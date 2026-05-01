import { POST } from './route';

jest.mock('@/lib/admin', () => ({
  adminDb: { from: jest.fn() },
}));

jest.mock('@/utils/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
  },
}));

jest.mock('next/server', () => {
  const MockNextResponse = jest.fn().mockImplementation((body: string, init?: { status?: number }) => ({
    body,
    status: init?.status ?? 200,
  }));
  return { NextResponse: MockNextResponse };
});

function buildChain(result: { error: unknown }) {
  const chain: Record<string, unknown> = {};
  ['update', 'eq'].forEach((m) => {
    chain[m] = jest.fn().mockReturnValue(chain);
  });
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return chain;
}

describe('POST /api/stripe/webhook', () => {
  const { adminDb } = jest.requireMock('@/lib/admin');
  const { stripe } = jest.requireMock('@/utils/stripe');

  function makeRequest(body: string, signature: string) {
    return new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': signature },
      body,
    });
  }

  beforeEach(() => jest.clearAllMocks());

  it('returns 400 when signature verification fails', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const req = makeRequest('{}', 'bad-sig');
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('updates payment to paid when checkout.session.completed fires', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { metadata: { submissionId: 'sub-123' } } },
    });

    const paymentsChain = buildChain({ error: null });
    (adminDb.from as jest.Mock).mockReturnValue(paymentsChain);

    const req = makeRequest('{}', 'valid-sig');
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(adminDb.from).toHaveBeenCalledWith('payments');
    expect(paymentsChain.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'paid' })
    );
    expect(paymentsChain.eq).toHaveBeenCalledWith('submission_id', 'sub-123');
  });

  it('skips database update when submissionId is missing from metadata', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { metadata: {} } },
    });

    const req = makeRequest('{}', 'valid-sig');
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(adminDb.from).not.toHaveBeenCalled();
  });

  it('ignores unhandled event types and returns 200', async () => {
    (stripe.webhooks.constructEvent as jest.Mock).mockReturnValue({
      type: 'invoice.payment_failed',
      data: { object: {} },
    });

    const req = makeRequest('{}', 'valid-sig');
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(adminDb.from).not.toHaveBeenCalled();
  });
});

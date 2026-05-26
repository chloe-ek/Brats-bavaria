import { POST } from './route';

jest.mock('@/lib/admin', () => ({
  adminDb: { from: jest.fn() },
}));

jest.mock('@/utils/stripe', () => ({
  stripe: {
    customers: { create: jest.fn() },
    products: { create: jest.fn() },
    prices: { create: jest.fn() },
    paymentLinks: { create: jest.fn() },
  },
}));

jest.mock('@/utils/resend', () => ({
  resend: {
    emails: { send: jest.fn() },
  },
}));

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data: object, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: () => Promise.resolve(data),
    })),
  },
}));

function buildChain(result: { error: unknown }) {
  const chain: Record<string, unknown> = {};
  ['update', 'eq', 'upsert', 'insert'].forEach((m) => {
    chain[m] = jest.fn().mockReturnValue(chain);
  });
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return chain;
}

describe('POST /api/admin/submissions/[id]/approved', () => {
  const { adminDb } = jest.requireMock('@/lib/admin');
  const { stripe } = jest.requireMock('@/utils/stripe');
  const { resend } = jest.requireMock('@/utils/resend');

  function makeRequest(body: object, id: string) {
    return {
      request: new Request(`http://localhost/api/admin/submissions/${id}/approved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
      context: { params: Promise.resolve({ id }) },
    };
  }

  beforeEach(() => jest.clearAllMocks());

  it('approves submission, creates Stripe payment link, and sends email', async () => {
    const submissionsChain = buildChain({ error: null });
    const reviewsChain = buildChain({ error: null });
    const paymentsChain = buildChain({ error: null });

    (adminDb.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'submissions') return submissionsChain;
      if (table === 'reviews') return reviewsChain;
      return paymentsChain;
    });

    (stripe.customers.create as jest.Mock).mockResolvedValue({ id: 'cus_123' });
    (stripe.products.create as jest.Mock).mockResolvedValue({ id: 'prod_123' });
    (stripe.prices.create as jest.Mock).mockResolvedValue({ id: 'price_123' });
    (stripe.paymentLinks.create as jest.Mock).mockResolvedValue({
      id: 'plink_123',
      url: 'https://buy.stripe.com/test',
    });
    (resend.emails.send as jest.Mock).mockResolvedValue({ error: null });

    const { request, context } = makeRequest({ email: 'user@example.com', name: 'Jane' }, 'sub-123');
    const res = await POST(request, context);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);

    expect(submissionsChain.update).toHaveBeenCalledWith({ status: 'approved' });
    expect(submissionsChain.eq).toHaveBeenCalledWith('id', 'sub-123');

    expect(stripe.customers.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'user@example.com', name: 'Jane' })
    );
    expect(stripe.paymentLinks.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ submissionId: 'sub-123' }),
      })
    );

    expect(adminDb.from).toHaveBeenCalledWith('payments');
    expect(paymentsChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ submission_id: 'sub-123', status: 'unpaid', amount: 4200 })
    );

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'user@example.com' })
    );
  });

  it('returns 500 and skips Stripe and email when submission update fails', async () => {
    const failChain = buildChain({ error: { message: 'DB error' } });
    (adminDb.from as jest.Mock).mockReturnValue(failChain);

    const { request, context } = makeRequest({ email: 'user@example.com', name: 'Jane' }, 'sub-123');
    const res = await POST(request, context);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to update approval status');
    expect(stripe.customers.create).not.toHaveBeenCalled();
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it('returns 500 when Stripe throws an error', async () => {
    const submissionsChain = buildChain({ error: null });
    const reviewsChain = buildChain({ error: null });

    (adminDb.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'submissions') return submissionsChain;
      return reviewsChain;
    });

    (stripe.customers.create as jest.Mock).mockRejectedValue(new Error('Stripe unavailable'));

    const { request, context } = makeRequest({ email: 'user@example.com', name: 'Jane' }, 'sub-123');
    const res = await POST(request, context);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to process approval workflow');
    expect(resend.emails.send).not.toHaveBeenCalled();
  });
});

import { POST } from './route';

jest.mock('@/lib/admin', () => ({
  adminDb: { from: jest.fn() },
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
  ['update', 'eq', 'upsert'].forEach((m) => {
    chain[m] = jest.fn().mockReturnValue(chain);
  });
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return chain;
}

describe('POST /api/admin/submissions/[id]/rejected', () => {
  const { adminDb } = jest.requireMock('@/lib/admin');

  function makeRequest(id: string) {
    return {
      request: new Request(`http://localhost/api/admin/submissions/${id}/rejected`, {
        method: 'POST',
      }),
      context: { params: Promise.resolve({ id }) },
    };
  }

  beforeEach(() => jest.clearAllMocks());

  it('rejects submission and marks review as seen', async () => {
    const submissionsChain = buildChain({ error: null });
    const reviewsChain = buildChain({ error: null });

    (adminDb.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'submissions') return submissionsChain;
      return reviewsChain;
    });

    const { request, context } = makeRequest('sub-123');
    const res = await POST(request, context);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);

    expect(submissionsChain.update).toHaveBeenCalledWith({ status: 'rejected' });
    expect(submissionsChain.eq).toHaveBeenCalledWith('id', 'sub-123');

    expect(adminDb.from).toHaveBeenCalledWith('reviews');
    expect(reviewsChain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ submission_id: 'sub-123', seen: true }),
      expect.anything()
    );
  });

  it('returns 500 and skips review update when submission update fails', async () => {
    const failChain = buildChain({ error: { message: 'DB error' } });
    (adminDb.from as jest.Mock).mockReturnValue(failChain);

    const { request, context } = makeRequest('sub-123');
    const res = await POST(request, context);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.error).toBe('Failed to reject');
    expect(adminDb.from).not.toHaveBeenCalledWith('reviews');
  });
});

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

function buildSupabaseChain(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {};
  const methods = ['upsert', 'insert', 'select', 'order', 'gte', 'lt', 'eq', 'update'];
  methods.forEach((m) => {
    chain[m] = jest.fn().mockReturnValue(chain);
  });
  chain.single = jest.fn().mockResolvedValue(result);
  chain.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return chain;
}

describe('POST /api/submit', () => {
  const { adminDb } = jest.requireMock('@/lib/admin');

  function makeRequest(body: object) {
    return new Request('http://localhost/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  beforeEach(() => jest.clearAllMocks());

  it('creates applicant, submission, and photos then returns success', async () => {
    const applicantChain = buildSupabaseChain({ data: { id: 'applicant-1' }, error: null });
    const submissionChain = buildSupabaseChain({ data: { id: 'submission-1' }, error: null });
    const photosChain = buildSupabaseChain({ data: null, error: null });

    (adminDb.from as jest.Mock).mockImplementation((table: string) => {
      if (table === 'applicants') return applicantChain;
      if (table === 'submissions') return submissionChain;
      return photosChain;
    });

    const req = makeRequest({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-1234',
      make: 'BMW',
      model: 'M3',
      year: 2022,
      photos: ['https://cdn.example.com/photo1.jpg'],
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.submissionId).toBe('submission-1');
    expect(adminDb.from).toHaveBeenCalledWith('applicants');
    expect(adminDb.from).toHaveBeenCalledWith('submissions');
    expect(adminDb.from).toHaveBeenCalledWith('photos');
  });

  it('returns 500 when applicant upsert fails', async () => {
    const failChain = buildSupabaseChain({ data: null, error: { message: 'DB error' } });
    (adminDb.from as jest.Mock).mockReturnValue(failChain);

    const req = makeRequest({ name: 'Jane', email: 'jane@example.com', make: 'BMW', model: 'M3', year: 2022 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Failed to save applicant');
  });

  it('returns 500 when submission insert fails', async () => {
    const applicantChain = buildSupabaseChain({ data: { id: 'applicant-1' }, error: null });
    const submissionChain = buildSupabaseChain({ data: null, error: { message: 'Insert failed' } });

    (adminDb.from as jest.Mock).mockImplementation((table: string) =>
      table === 'applicants' ? applicantChain : submissionChain
    );

    const req = makeRequest({ name: 'Jane', email: 'jane@example.com', make: 'BMW', model: 'M3', year: 2022 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Database insert failed');
  });

  it('skips photo insert when photos array is empty', async () => {
    const applicantChain = buildSupabaseChain({ data: { id: 'applicant-1' }, error: null });
    const submissionChain = buildSupabaseChain({ data: { id: 'submission-1' }, error: null });

    (adminDb.from as jest.Mock).mockImplementation((table: string) =>
      table === 'applicants' ? applicantChain : submissionChain
    );

    const req = makeRequest({ name: 'Jane', email: 'jane@example.com', make: 'BMW', model: 'M3', year: 2022, photos: [] });
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(adminDb.from).not.toHaveBeenCalledWith('photos');
  });

  it('returns 500 on unexpected server error', async () => {
    (adminDb.from as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    const req = makeRequest({ name: 'Jane', email: 'jane@example.com', make: 'BMW', model: 'M3', year: 2022 });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Server error');
  });
});

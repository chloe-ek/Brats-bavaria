import { GET } from './route';

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

function buildQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const methods = ['select', 'order', 'gte', 'lt'];
  methods.forEach((m) => {
    builder[m] = jest.fn().mockReturnValue(builder);
  });
  builder.then = (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve);
  return builder;
}

describe('GET /api/admin/submissions', () => {
  const { adminDb } = jest.requireMock('@/lib/admin');

  beforeEach(() => jest.clearAllMocks());

  it('returns all submissions when no year filter is provided', async () => {
    const mockSubmissions = [
      { id: '1', car_make: 'BMW', submitted_at: '2026-01-02T00:00:00Z' },
      { id: '2', car_make: 'Audi', submitted_at: '2026-01-01T00:00:00Z' },
    ];
    const builder = buildQueryBuilder({ data: mockSubmissions, error: null });
    (adminDb.from as jest.Mock).mockReturnValue(builder);

    const req = new Request('http://localhost/api/admin/submissions');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.submissions).toEqual(mockSubmissions);
    expect(builder.gte).not.toHaveBeenCalled();
    expect(builder.lt).not.toHaveBeenCalled();
  });

  it('applies year filter when year query param is provided', async () => {
    const builder = buildQueryBuilder({ data: [], error: null });
    (adminDb.from as jest.Mock).mockReturnValue(builder);

    const req = new Request('http://localhost/api/admin/submissions?year=2025');
    await GET(req);

    expect(builder.gte).toHaveBeenCalledWith('submitted_at', '2025-01-01');
    expect(builder.lt).toHaveBeenCalledWith('submitted_at', '2026-01-01');
  });

  it('returns 500 when database query fails', async () => {
    const builder = buildQueryBuilder({ data: null, error: { message: 'Connection failed' } });
    (adminDb.from as jest.Mock).mockReturnValue(builder);

    const req = new Request('http://localhost/api/admin/submissions');
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Failed to fetch submissions');
  });

  it('orders results by submitted_at descending', async () => {
    const builder = buildQueryBuilder({ data: [], error: null });
    (adminDb.from as jest.Mock).mockReturnValue(builder);

    const req = new Request('http://localhost/api/admin/submissions');
    await GET(req);

    expect(builder.order).toHaveBeenCalledWith('submitted_at', { ascending: false });
  });
});

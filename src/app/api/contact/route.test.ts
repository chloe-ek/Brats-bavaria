import { POST } from './route';

jest.mock('@/utils/resend', () => ({
  resend: {
    emails: {
      send: jest.fn(),
    },
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

describe('POST /api/contact', () => {
  const { resend } = jest.requireMock('@/utils/resend');

  function makeRequest(body: object) {
    return new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  beforeEach(() => jest.clearAllMocks());

  it('sends email and returns success', async () => {
    (resend.emails.send as jest.Mock).mockResolvedValue({ error: null });

    const req = makeRequest({ name: 'John', email: 'john@example.com', message: 'Hello!' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'pbe46m3@gmail.com',
        subject: 'New Message from John',
      })
    );
  });

  it('includes sender name and email in the email body', async () => {
    (resend.emails.send as jest.Mock).mockResolvedValue({ error: null });

    const req = makeRequest({ name: 'Jane', email: 'jane@example.com', message: 'Test message' });
    await POST(req);

    const call = (resend.emails.send as jest.Mock).mock.calls[0][0];
    expect(call.html).toContain('Jane');
    expect(call.html).toContain('jane@example.com');
    expect(call.html).toContain('Test message');
  });

  it('returns 500 when email sending fails', async () => {
    (resend.emails.send as jest.Mock).mockResolvedValue({ error: { message: 'API rate limit' } });

    const req = makeRequest({ name: 'John', email: 'john@example.com', message: 'Hello!' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Failed to send email');
  });

  it('returns 500 when resend throws an exception', async () => {
    (resend.emails.send as jest.Mock).mockRejectedValue(new Error('Network error'));

    const req = makeRequest({ name: 'John', email: 'john@example.com', message: 'Hello!' });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('Server error');
  });
});

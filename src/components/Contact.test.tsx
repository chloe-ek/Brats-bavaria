import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Contact from './Contact';

global.fetch = jest.fn();

describe('Contact component', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the contact form with all required fields', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows "Sending..." while the request is in flight', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<Contact />);
    fillForm('Alice', 'alice@example.com', 'Hi there');
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeInTheDocument();
    });
  });

  it('shows success message and clears form after successful submission', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<Contact />);
    fillForm('Alice', 'alice@example.com', 'Hi there');
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Thanks for your message.')).toBeInTheDocument();
    });

    expect((screen.getByPlaceholderText('Enter your name') as HTMLInputElement).value).toBe('');
    expect((screen.getByPlaceholderText('Enter your email') as HTMLInputElement).value).toBe('');
    expect((screen.getByPlaceholderText('Enter your message') as HTMLTextAreaElement).value).toBe('');
  });

  it('shows server error message when submission fails with a message', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Service unavailable' }),
    });

    render(<Contact />);
    fillForm('Alice', 'alice@example.com', 'Hi there');
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Service unavailable')).toBeInTheDocument();
    });
  });

  it('shows fallback error message when fetch throws', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<Contact />);
    fillForm('Alice', 'alice@example.com', 'Hi there');
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Failed to send. Please try again later.')).toBeInTheDocument();
    });
  });

  it('sends form data as JSON to /api/contact', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<Contact />);
    fillForm('Alice', 'alice@example.com', 'Hello');
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }).closest('form')!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', message: 'Hello' }),
      }));
    });
  });
});

function fillForm(name: string, email: string, message: string) {
  fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
    target: { value: name, name: 'name' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
    target: { value: email, name: 'email' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter your message'), {
    target: { value: message, name: 'message' },
  });
}

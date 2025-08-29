import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Submit from './page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

jest.mock('browser-image-compression', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(new File([''], 'compressed.jpg', { type: 'image/jpeg' })))
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush
});

describe('Submit Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render contact information form fields', () => {
    render(<Submit />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('should validate email confirmation matching', async () => {
    render(<Submit />);
    
    const emailInput = screen.getByLabelText(/^email$/i);
    const confirmEmailInput = screen.getByLabelText(/confirm email/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(confirmEmailInput, { target: { value: 'different@example.com' } });
    
    await waitFor(() => {
      expect(screen.getByText('Emails do not match')).toBeInTheDocument();
    });
  });

  it('should clear email error when emails match', async () => {
    render(<Submit />);
    
    const emailInput = screen.getByLabelText(/^email$/i);
    const confirmEmailInput = screen.getByLabelText(/confirm email/i);
    
    // First set mismatched emails
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(confirmEmailInput, { target: { value: 'different@example.com' } });
    
    await waitFor(() => {
      expect(screen.getByText('Emails do not match')).toBeInTheDocument();
    });
    
    // Then fix the confirmation email
    fireEvent.change(confirmEmailInput, { target: { value: 'test@example.com' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Emails do not match')).not.toBeInTheDocument();
    });
  });

  it('should validate minimum photo upload requirement', async () => {
    render(<Submit />);
    
    const fileInput = screen.getByLabelText(/upload 3 to 5 car photos/i);
    
    // Create mock files (less than 3)
    const files = [
      new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
      new File(['photo2'], 'photo2.jpg', { type: 'image/jpeg' })
    ];
    
    fireEvent.change(fileInput, { target: { files } });
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please upload at least 3 photos. ');
    });
  });

  it('should validate maximum photo upload limit', async () => {
    render(<Submit />);
    
    const fileInput = screen.getByLabelText(/upload 3 to 5 car photos/i);
    
    // Create mock files (more than 5)
    const files = Array.from({ length: 6 }, (_, i) => 
      new File([`photo${i + 1}`], `photo${i + 1}.jpg`, { type: 'image/jpeg' })
    );
    
    fireEvent.change(fileInput, { target: { files } });
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('You can upload up to 5 photos only.');
    });
  });

  it('should accept valid photo upload (3-5 photos)', async () => {
    render(<Submit />);
    
    const fileInput = screen.getByLabelText(/upload 3 to 5 car photos/i);
    
    // Create mock files (valid range)
    const files = [
      new File(['photo1'], 'photo1.jpg', { type: 'image/jpeg' }),
      new File(['photo2'], 'photo2.jpg', { type: 'image/jpeg' }),
      new File(['photo3'], 'photo3.jpg', { type: 'image/jpeg' })
    ];
    
    fireEvent.change(fileInput, { target: { files } });
    
    // Should not show error toasts for valid file count
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('should prevent form submission with mismatched emails', async () => {
    render(<Submit />);
    
    const emailInput = screen.getByLabelText(/^email$/i);
    const confirmEmailInput = screen.getByLabelText(/confirm email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(confirmEmailInput, { target: { value: 'different@example.com' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Emails do not match')).toBeInTheDocument();
    });
  });
});
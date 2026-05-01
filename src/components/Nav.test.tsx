import { fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Nav from './Nav';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Nav component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the logo image', () => {
    render(<Nav />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Nav />);
    expect(screen.getAllByRole('link', { name: 'Home' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Location' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThan(0);
  });

  it('navigates to /submit when Apply button is clicked', () => {
    render(<Nav />);
    const [firstApplyButton] = screen.getAllByRole('button', { name: /apply/i });
    fireEvent.click(firstApplyButton);
    expect(mockPush).toHaveBeenCalledWith('/submit');
  });

  it('mobile menu is initially hidden (translate-x-full)', () => {
    const { container } = render(<Nav />);
    const mobileMenu = container.querySelector('ul');
    expect(mobileMenu).toHaveClass('translate-x-full');
  });

  it('opens mobile menu when hamburger button is clicked', () => {
    const { container } = render(<Nav />);
    const mobileMenu = container.querySelector('ul')!;
    const hamburgerButton = container.querySelector('button.md\\:hidden')!;

    fireEvent.click(hamburgerButton);

    expect(mobileMenu.classList.contains('translate-x-full')).toBe(false);
  });

  it('closes mobile menu when the close button is clicked', () => {
    const { container } = render(<Nav />);
    const mobileMenu = container.querySelector('ul')!;
    const hamburgerButton = container.querySelector('button.md\\:hidden')!;

    fireEvent.click(hamburgerButton);
    expect(mobileMenu.classList.contains('translate-x-full')).toBe(false);

    const closeButton = mobileMenu.querySelector('button')!;
    fireEvent.click(closeButton);
    expect(mobileMenu).toHaveClass('translate-x-full');
  });

  it('closes mobile menu when a nav link is clicked', () => {
    const { container } = render(<Nav />);
    const mobileMenu = container.querySelector('ul')!;
    const hamburgerButton = container.querySelector('button.md\\:hidden')!;

    fireEvent.click(hamburgerButton);
    expect(mobileMenu.classList.contains('translate-x-full')).toBe(false);

    const homeLink = mobileMenu.querySelector('a[href="/"]')!;
    fireEvent.click(homeLink);
    expect(mobileMenu).toHaveClass('translate-x-full');
  });
});

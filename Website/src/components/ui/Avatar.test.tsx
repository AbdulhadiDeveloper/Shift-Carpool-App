import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar Component', () => {
  it('renders initials correctly for a full name', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials correctly for a single name', () => {
    render(<Avatar name="Alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('applies the correct size classes', () => {
    const { container } = render(<Avatar name="Test User" size="lg" />);
    // Check if the lg size classes are present
    expect(container.firstChild).toHaveClass('w-12 h-12 text-title-md');
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar name="Test User" className="custom-test-class" />);
    expect(container.firstChild).toHaveClass('custom-test-class');
  });
});

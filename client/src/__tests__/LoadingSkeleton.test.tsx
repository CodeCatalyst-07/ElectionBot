/**
 * Smoke test for LoadingSkeleton component.
 * Verifies the component renders without crashing and
 * uses the correct ARIA presentation role.
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoadingSkeleton from '../components/ChatBot/LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders without crashing', () => {
    render(<LoadingSkeleton />);
  });

  it('has the presentation role so screen readers skip the skeleton', () => {
    render(<LoadingSkeleton />);
    // aria-hidden="true" hides the skeleton from the a11y tree — use { hidden: true }
    expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
  });
});

/**
 * Smoke test for TypingIndicator component.
 * Verifies the component renders without crashing and
 * exposes the correct accessibility role.
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TypingIndicator from '../components/ChatBot/TypingIndicator';

describe('TypingIndicator', () => {
  it('renders without crashing', () => {
    render(<TypingIndicator />);
  });

  it('shows a status role for screen readers', () => {
    render(<TypingIndicator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has the correct aria-label', () => {
    render(<TypingIndicator />);
    expect(screen.getByLabelText('ElectionBot is typing')).toBeInTheDocument();
  });
});

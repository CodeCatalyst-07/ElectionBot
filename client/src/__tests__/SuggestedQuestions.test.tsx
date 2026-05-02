/**
 * Smoke test for SuggestedQuestions component.
 * framer-motion is mocked so animation wrappers don't break jsdom.
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SuggestedQuestions from '../components/ChatBot/SuggestedQuestions';

// Mock framer-motion to avoid animation-related jsdom issues
jest.mock('framer-motion', () => ({
  motion: {
    button: ({
      children,
      onClick,
      ...rest
    }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) => (
      <button onClick={onClick} {...rest}>
        {children}
      </button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('SuggestedQuestions', () => {
  it('renders without crashing', () => {
    render(<SuggestedQuestions onSelect={jest.fn()} />);
  });

  it('renders the suggested questions list', () => {
    render(<SuggestedQuestions onSelect={jest.fn()} />);
    expect(screen.getByRole('list', { name: /suggested questions/i })).toBeInTheDocument();
  });

  it('calls onSelect with the question text when a chip is clicked', async () => {
    const onSelect = jest.fn();
    render(<SuggestedQuestions onSelect={onSelect} />);
    const buttons = screen.getAllByRole('listitem');
    await userEvent.click(buttons[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(typeof onSelect.mock.calls[0][0]).toBe('string');
  });
});

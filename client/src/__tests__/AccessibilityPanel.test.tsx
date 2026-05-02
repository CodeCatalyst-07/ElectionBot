/**
 * Smoke test for AccessibilityPanel component.
 * framer-motion is mocked so animation wrappers don't break jsdom.
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibilityPanel from '../components/Accessibility/AccessibilityPanel';
import { AccessibilitySettings } from '../types/index';

// Mock framer-motion to avoid animation-related jsdom issues
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => (
      <div {...rest}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const defaultSettings: AccessibilitySettings = {
  largerFont: false,
  highContrast: false,
  dyslexicFont: false,
  reducedMotion: false,
  screenReaderMode: false,
};

describe('AccessibilityPanel', () => {
  it('renders the trigger button without crashing', () => {
    render(<AccessibilityPanel settings={defaultSettings} onToggle={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /open accessibility settings panel/i }),
    ).toBeInTheDocument();
  });

  it('opens the settings panel when the trigger button is clicked', async () => {
    render(<AccessibilityPanel settings={defaultSettings} onToggle={jest.fn()} />);
    await userEvent.click(
      screen.getByRole('button', { name: /open accessibility settings panel/i }),
    );
    expect(screen.getByRole('dialog', { name: /accessibility settings/i })).toBeInTheDocument();
  });

  it('calls onToggle when a setting switch is clicked', async () => {
    const onToggle = jest.fn();
    render(<AccessibilityPanel settings={defaultSettings} onToggle={onToggle} />);
    // Open the panel first
    await userEvent.click(
      screen.getByRole('button', { name: /open accessibility settings panel/i }),
    );
    const switches = screen.getAllByRole('switch');
    await userEvent.click(switches[0]);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

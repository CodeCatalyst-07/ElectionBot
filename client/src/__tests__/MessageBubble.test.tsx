/**
 * Smoke test for MessageBubble component.
 * Verifies user and bot messages render without crashing
 * with minimal required props.
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MessageBubble from '../components/ChatBot/MessageBubble';
import { ChatMessage } from '../types/index';

const mockUserMessage: ChatMessage = {
  id: 'msg-1',
  role: 'user',
  content: 'How do I register to vote?',
  timestamp: 1700000000000,
};

const mockBotMessage: ChatMessage = {
  id: 'msg-2',
  role: 'model',
  content: 'You can register to vote at your local election office.',
  timestamp: 1700000001000,
};

describe('MessageBubble', () => {
  it('renders a user message without crashing', () => {
    render(
      <MessageBubble
        message={mockUserMessage}
        isPlaying={false}
        language="en"
        onPlay={jest.fn()}
        onStop={jest.fn()}
      />,
    );
    expect(screen.getByText('How do I register to vote?')).toBeInTheDocument();
  });

  it('renders a bot message with a Listen button', () => {
    render(
      <MessageBubble
        message={mockBotMessage}
        isPlaying={false}
        language="en"
        onPlay={jest.fn()}
        onStop={jest.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /read message aloud/i })).toBeInTheDocument();
  });

  it('shows a Stop button when isPlaying is true', () => {
    render(
      <MessageBubble
        message={mockBotMessage}
        isPlaying={true}
        language="en"
        onPlay={jest.fn()}
        onStop={jest.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /stop reading aloud/i })).toBeInTheDocument();
  });
});

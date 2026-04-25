import { ChatMessage } from '../../types/index';

interface MessageBubbleProps {
  message: ChatMessage;
  isPlaying: boolean;
  language: string;
  onPlay: () => void;
  onStop: () => void;
}

/** Formats a Unix timestamp into a readable HH:MM string. */
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Renders markdown-lite: bold text and line breaks in bot messages. */
function renderMessageContent(content: string): JSX.Element {
  const parts = content.split('\n');
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part.split(/\*\*(.*?)\*\*/g).map((segment, segIndex) =>
            segIndex % 2 === 1 ? (
              <strong key={segIndex}>{segment}</strong>
            ) : (
              segment
            ),
          )}
          {index < parts.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

/**
 * Renders a single chat message bubble.
 * User messages appear right-aligned in blue.
 * Bot messages appear left-aligned with a speaker TTS button.
 */
export default function MessageBubble({
  message,
  isPlaying,
  onPlay,
  onStop,
}: MessageBubbleProps): JSX.Element {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      aria-label={`${isUser ? 'You' : 'ElectionBot'}: ${message.content}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 bg-civic-blue-600 rounded-full flex items-center justify-center text-sm flex-shrink-0 mb-1"
          aria-hidden="true"
        >
          🤖
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-xs sm:max-w-md lg:max-w-lg ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {renderMessageContent(message.content)}
          </p>
        </div>

        {/* Timestamp + TTS button */}
        <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <time
            className="text-xs text-gray-400"
            dateTime={new Date(message.timestamp).toISOString()}
          >
            {formatTime(message.timestamp)}
          </time>

          {!isUser && (
            <button
              onClick={isPlaying ? onStop : onPlay}
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all ${
                isPlaying
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-civic-blue-50 hover:text-civic-blue-600'
              }`}
              aria-label={isPlaying ? 'Stop reading aloud' : 'Read message aloud'}
              aria-pressed={isPlaying}
            >
              <span aria-hidden="true">{isPlaying ? '⏹' : '🔊'}</span>
              <span>{isPlaying ? 'Stop' : 'Listen'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Animated 3-dot typing indicator shown while ElectionBot is generating a response.
 * Uses CSS keyframe animation defined in index.css.
 */
export default function TypingIndicator(): JSX.Element {
  return (
    <div
      className="flex items-end gap-2"
      role="status"
      aria-label="ElectionBot is typing"
      aria-live="polite"
    >
      <div
        className="w-7 h-7 bg-civic-blue-600 rounded-full flex items-center justify-center text-sm flex-shrink-0"
        aria-hidden="true"
      >
        🤖
      </div>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4" aria-hidden="true">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

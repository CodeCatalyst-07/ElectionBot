import { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from '../../types/index';

interface ChatBotProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isFirstTimeVoter: boolean;
  language: string;
  onSendMessage: (text: string) => void;
  onToggleFirstTimeVoter: () => void;
  onPlayTTS: (messageId: string, text: string) => void;
  onStopTTS: () => void;
  playingMessageId: string | null;
}

/**
 * Main chatbot container: message list, input bar, first-time voter toggle.
 * Orchestrates all chatbot sub-components.
 */
export default function ChatBot({
  messages,
  isLoading,
  error,
  isFirstTimeVoter,
  language,
  onSendMessage,
  onToggleFirstTimeVoter,
  onPlayTTS,
  onStopTTS,
  playingMessageId,
}: ChatBotProps): JSX.Element {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (): void => {
    const text = inputRef.current?.value.trim() ?? '';
    if (!text || isLoading) return;
    if (inputRef.current) inputRef.current.value = '';
    onSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 bg-civic-blue-600 rounded-full flex items-center justify-center text-lg"
            aria-hidden="true"
          >
            🤖
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">ElectionBot</p>
            <p className="text-xs text-civic-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-civic-green-500 rounded-full inline-block" aria-hidden="true" />
              AI Election Assistant
            </p>
          </div>
        </div>

        {/* First-time voter toggle */}
        <button
          onClick={onToggleFirstTimeVoter}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            isFirstTimeVoter
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
          aria-pressed={isFirstTimeVoter}
          aria-label="Toggle first-time voter mode for simpler explanations"
        >
          <span aria-hidden="true">🌱</span>
          First-time voter
        </button>
      </div>

      {/* Message area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {isEmpty && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4" aria-hidden="true">🗳️</div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Ask ElectionBot anything</h2>
            <p className="text-gray-500 text-sm mb-6">
              I&apos;m your AI guide to elections in India and the USA.
            </p>
            <SuggestedQuestions onSelect={onSendMessage} />
          </div>
        )}

        {messages.length > 0 && messages.length < 3 && (
          <div className="mb-2">
            <SuggestedQuestions onSelect={onSendMessage} compact />
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MessageBubble
                message={msg}
                isPlaying={playingMessageId === msg.id}
                onPlay={() => onPlayTTS(msg.id, msg.content)}
                onStop={onStopTTS}
                language={language}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}

        {error && (
          <div
            className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-2 focus-within:ring-2 focus-within:ring-civic-blue-400 focus-within:border-transparent transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Ask about voter registration, elections, EVMs…"
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 outline-none py-2 max-h-28"
            aria-label="Type your election question"
            aria-multiline="true"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-shrink-0 w-9 h-9 bg-civic-blue-600 hover:bg-civic-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
            aria-label="Send message"
          >
            <span className="text-white text-sm" aria-hidden="true">↑</span>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">
          ElectionBot answers election questions only · Not a substitute for official sources
        </p>
      </div>
    </div>
  );
}

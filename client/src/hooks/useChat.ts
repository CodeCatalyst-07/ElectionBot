import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatState } from '../types/index';
import { sendMessage } from '../services/chat.service';
import { sanitizeInput, isBlank } from '../utils/sanitize';

/**
 * Custom hook managing the full chat conversation state.
 * Handles session ID generation, message sending, history, and error states.
 *
 * @param language - Currently selected language code for chatbot responses
 * @returns Chat state and action handlers
 */
export function useChat(language: string): ChatState & {
  sendUserMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  isFirstTimeVoter: boolean;
  toggleFirstTimeVoter: () => void;
} {
  const sessionId = useRef<string>(uuidv4());

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFirstTimeVoter, setIsFirstTimeVoter] = useState(false);

  const sendUserMessage = useCallback(
    async (text: string): Promise<void> => {
      const sanitized = sanitizeInput(text);
      if (isBlank(sanitized)) return;

      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content: sanitized,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await sendMessage(
          sanitized,
          sessionId.current,
          isFirstTimeVoter,
          language,
        );

        const botMessage: ChatMessage = {
          id: uuidv4(),
          role: 'model',
          content: response.reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [isFirstTimeVoter, language],
  );

  const clearChat = useCallback((): void => {
    setMessages([]);
    setError(null);
    sessionId.current = uuidv4();
  }, []);

  const toggleFirstTimeVoter = useCallback((): void => {
    setIsFirstTimeVoter((prev) => !prev);
  }, []);

  return {
    messages,
    sessionId: sessionId.current,
    isLoading,
    error,
    isFirstTimeVoter,
    sendUserMessage,
    clearChat,
    toggleFirstTimeVoter,
  };
}

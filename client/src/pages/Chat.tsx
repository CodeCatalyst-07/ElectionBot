import ChatBot from '../components/ChatBot/ChatBot';
import { useChat } from '../hooks/useChat';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface ChatPageProps {
  language: string;
}

/**
 * Full-page chat view — fills the viewport below the navbar.
 */
export default function ChatPage({ language }: ChatPageProps): JSX.Element {
  const {
    messages,
    isLoading,
    error,
    isFirstTimeVoter,
    sendUserMessage,
    toggleFirstTimeVoter,
  } = useChat(language);

  const { playingMessageId, playMessage, stopPlayback } = useTextToSpeech(language);

  return (
    <main
      className="pt-16 h-screen flex flex-col"
      aria-label="Chat with ElectionBot"
    >
      <div className="flex-1 overflow-hidden max-w-4xl w-full mx-auto px-0 sm:px-4 py-4 flex flex-col">
        <div className="flex-1 rounded-none sm:rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white flex flex-col">
          <ChatBot
            messages={messages}
            isLoading={isLoading}
            error={error}
            isFirstTimeVoter={isFirstTimeVoter}
            language={language}
            onSendMessage={(text) => { void sendUserMessage(text); }}
            onToggleFirstTimeVoter={toggleFirstTimeVoter}
            onPlayTTS={(id, text) => { void playMessage(id, text); }}
            onStopTTS={stopPlayback}
            playingMessageId={playingMessageId}
          />
        </div>
      </div>
    </main>
  );
}

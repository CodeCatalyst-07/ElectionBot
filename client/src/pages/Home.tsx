import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../components/Hero/Hero';
import FeatureHighlights from '../components/Features/FeatureHighlights';
import Timeline from '../components/Timeline/Timeline';
import ChatBot from '../components/ChatBot/ChatBot';
import { useChat } from '../hooks/useChat';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { initiateCalendarAuth, readCalendarCallbackResult } from '../services/calendar.service';

interface HomeProps {
  language: string;
}

/**
 * Homepage assembling Hero, FeatureHighlights, Timeline preview, and a quick-start chatbot panel.
 */
export default function Home({ language }: HomeProps): JSX.Element {
  const { messages, isLoading, error, isFirstTimeVoter, sendUserMessage, toggleFirstTimeVoter } = useChat(language);
  const { playingMessageId, playMessage, stopPlayback } = useTextToSpeech(language);

  // Handle Calendar OAuth2 callback result on page load
  useEffect(() => {
    const result = readCalendarCallbackResult();
    if (result.status === 'success') {
      alert(`✅ Success! Added ${result.eventCount ?? 4} election events to your Google Calendar.`);
      window.history.replaceState({}, '', '/');
    } else if (result.status === 'error') {
      alert('⚠️ Could not add events to Google Calendar. Please try again.');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <main id="main-content">
      {/* Skip to main content link for keyboard/screen reader users */}
      <a
        href="#quick-chat"
        className="sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 bg-white px-4 py-2 rounded-lg shadow z-50 text-civic-blue-700 font-medium"
      >
        Skip to chat
      </a>

      <Hero />
      <FeatureHighlights />

      {/* Timeline Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" aria-labelledby="timeline-preview-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="timeline-preview-heading" className="text-3xl font-bold text-gray-900 mb-3">
              How Elections Work
            </h2>
            <p className="text-gray-500 text-lg">Click any stage to expand and learn more.</p>
          </div>
          <Timeline />
          <div className="text-center mt-8">
            <Link
              to="/timeline"
              className="inline-flex items-center gap-2 text-civic-blue-600 font-semibold hover:text-civic-blue-800 transition-colors"
              aria-label="View full election timeline"
            >
              View full timeline →
            </Link>
          </div>
        </div>
      </section>

      {/* Quick-Start Chat Section */}
      <section
        id="quick-chat"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        aria-labelledby="quick-chat-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 id="quick-chat-heading" className="text-3xl font-bold text-gray-900 mb-3">
              Ask ElectionBot Anything
            </h2>
            <p className="text-gray-500 text-lg">Powered by Google Gemini AI — election questions only.</p>
          </div>

          {/* Calendar CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-civic-blue-600 to-civic-blue-700 text-white rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-semibold text-lg">📆 Add election deadlines to Google Calendar</h3>
              <p className="text-blue-200 text-sm mt-0.5">Get reminders 3 days before each key date.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => initiateCalendarAuth('india')}
                className="px-4 py-2 bg-white text-civic-blue-700 rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors"
                aria-label="Add Indian election dates to Google Calendar"
              >
                🇮🇳 India
              </button>
              <button
                onClick={() => initiateCalendarAuth('us')}
                className="px-4 py-2 bg-white/20 border border-white/40 text-white rounded-xl font-medium text-sm hover:bg-white/30 transition-colors"
                aria-label="Add US election dates to Google Calendar"
              >
                🇺🇸 US
              </button>
            </div>
          </motion.div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden h-[600px]">
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
      </section>
    </main>
  );
}

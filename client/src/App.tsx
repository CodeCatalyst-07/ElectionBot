import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar/Navbar';
import AccessibilityPanel from './components/Accessibility/AccessibilityPanel';
import { useAccessibility } from './hooks/useAccessibility';
import { useTranslation } from './hooks/useTranslation';

// Lazy-loaded pages for better initial load performance
const Home = lazy(() => import('./pages/Home'));
const ChatPage = lazy(() => import('./pages/Chat'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const VoterGuidePage = lazy(() => import('./pages/VoterGuidePage'));

/** Full-screen loading spinner shown during page lazy loading. */
function PageLoader(): JSX.Element {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="status"
      aria-label="Loading page"
    >
      <div className="text-center">
        <div className="text-4xl mb-3 animate-bounce" aria-hidden="true">🗳️</div>
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    </div>
  );
}

/**
 * Root application component.
 * Configures routing, global accessibility state, and language selection.
 * All Google API calls flow through the backend — never directly from the browser.
 */
export default function App(): JSX.Element {
  const { settings, toggleSetting } = useAccessibility();
  const { language, setLanguage } = useTranslation();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar selectedLanguage={language} onLanguageChange={setLanguage} />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/chat" element={<ChatPage language={language} />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/voter-guide" element={<VoterGuidePage />} />
            <Route path="/timeline" element={<VoterGuidePage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>

        <AccessibilityPanel settings={settings} onToggle={toggleSetting} />
      </div>
    </BrowserRouter>
  );
}

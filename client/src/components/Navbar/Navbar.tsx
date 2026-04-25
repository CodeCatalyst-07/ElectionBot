import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES } from '../../constants/index';
import { SupportedLanguage } from '../../types/index';

interface NavbarProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

const NAV_LINKS = [
  { label: 'Chat', path: '/chat' },
  { label: 'Timeline', path: '/timeline' },
  { label: 'Voter Guide', path: '/voter-guide' },
  { label: 'Quiz', path: '/quiz' },
];

/**
 * Top navigation bar with logo, page links, language selector, and mobile menu.
 */
export default function Navbar({ selectedLanguage, onLanguageChange }: NavbarProps): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const location = useLocation();

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-civic-blue-800 hover:text-civic-blue-600 transition-colors"
            aria-label="ElectionBot home"
          >
            <span className="text-2xl" role="img" aria-hidden="true">🗳️</span>
            <span>ElectionBot</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'bg-civic-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-civic-blue-50 hover:text-civic-blue-700'
                }`}
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language selector + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                aria-haspopup="listbox"
                aria-expanded={isLangMenuOpen}
                aria-label={`Language: ${currentLanguage?.name ?? 'English'}`}
              >
                <span role="img" aria-hidden="true">🌐</span>
                <span className="hidden sm:inline">{currentLanguage?.nativeName ?? 'English'}</span>
                <span className="text-xs text-gray-400">▾</span>
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50"
                    role="listbox"
                    aria-label="Select language"
                  >
                    {SUPPORTED_LANGUAGES.map((lang: SupportedLanguage) => (
                      <button
                        key={lang.code}
                        role="option"
                        aria-selected={lang.code === selectedLanguage}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          lang.code === selectedLanguage
                            ? 'bg-civic-blue-50 text-civic-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-gray-400 ml-2 text-xs">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="text-xl" aria-hidden="true">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-civic-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

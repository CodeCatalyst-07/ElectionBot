import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'election-bot-language';
const DEFAULT_LANGUAGE = 'en';

/**
 * Custom hook managing the selected UI language.
 * Selection persists in localStorage.
 *
 * @returns Selected language code and setter function
 */
export function useTranslation(): {
  language: string;
  setLanguage: (code: string) => void;
} {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  useEffect(() => {
    // Update <html lang> attribute for screen readers
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Silently ignore localStorage errors
    }
  }, [language]);

  const setLanguage = useCallback((code: string): void => {
    setLanguageState(code);
  }, []);

  return { language, setLanguage };
}

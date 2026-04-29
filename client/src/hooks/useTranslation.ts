import { useState, useEffect, useCallback } from 'react';
import { LANGUAGE_STORAGE_KEY as STORAGE_KEY, DEFAULT_LANGUAGE } from '../constants/index';

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

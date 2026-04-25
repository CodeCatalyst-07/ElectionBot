import { useState, useEffect, useCallback } from 'react';
import { AccessibilitySettings } from '../types/index';

const STORAGE_KEY = 'election-bot-accessibility';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  largerFont: false,
  highContrast: false,
  dyslexicFont: false,
  reducedMotion: false,
  screenReaderMode: false,
};

/** Maps AccessibilitySettings keys to CSS class names applied to <html>. */
const CSS_CLASS_MAP: Record<keyof AccessibilitySettings, string> = {
  largerFont: 'a11y-larger-font',
  highContrast: 'a11y-high-contrast',
  dyslexicFont: 'a11y-dyslexic-font',
  reducedMotion: 'a11y-reduced-motion',
  screenReaderMode: 'a11y-screen-reader',
};

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(stored) as Partial<AccessibilitySettings>) };
    }
  } catch {
    // localStorage unavailable — use defaults
  }
  return DEFAULT_SETTINGS;
}

function applySettingsToDOM(settings: AccessibilitySettings): void {
  const html = document.documentElement;
  (Object.keys(settings) as Array<keyof AccessibilitySettings>).forEach((key) => {
    const className = CSS_CLASS_MAP[key];
    if (settings[key]) {
      html.classList.add(className);
    } else {
      html.classList.remove(className);
    }
  });
}

/**
 * Custom hook managing all accessibility settings.
 * Settings persist in localStorage and are applied as CSS classes on <html>.
 *
 * @returns Current settings object and a toggle function
 */
export function useAccessibility(): {
  settings: AccessibilitySettings;
  toggleSetting: (key: keyof AccessibilitySettings) => void;
} {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  // Apply CSS classes on mount and whenever settings change
  useEffect(() => {
    applySettingsToDOM(settings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Silently ignore localStorage errors
    }
  }, [settings]);

  const toggleSetting = useCallback((key: keyof AccessibilitySettings): void => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { settings, toggleSetting };
}

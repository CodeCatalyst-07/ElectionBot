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

/**
 * Loads persisted accessibility settings from localStorage.
 * Falls back to DEFAULT_SETTINGS if nothing is stored or if
 * localStorage is unavailable (e.g. private browsing mode).
 *
 * @returns Merged AccessibilitySettings with stored overrides applied
 */
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

/**
 * Applies the current accessibility settings to the root `<html>` element
 * by adding or removing CSS class names from `CSS_CLASS_MAP`.
 * This drives features like high contrast, dyslexic font, and reduced motion
 * purely through CSS without React re-renders.
 *
 * @param settings - The current AccessibilitySettings to reflect in the DOM
 */
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

  /**
   * Toggles a single accessibility setting on or off.
   * The change is immediately reflected in the DOM and persisted to localStorage.
   *
   * @param key - The AccessibilitySettings property to toggle (e.g. 'highContrast', 'dyslexicFont')
   */
  const toggleSetting = useCallback((key: keyof AccessibilitySettings): void => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return { settings, toggleSetting };
}

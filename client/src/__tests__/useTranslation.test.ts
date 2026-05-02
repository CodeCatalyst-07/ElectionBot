/**
 * Smoke test for useTranslation hook.
 * Verifies the hook returns the default language on first render
 * and that setLanguage updates the state.
 */
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from '../hooks/useTranslation';

describe('useTranslation', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset the html lang attribute between tests
    document.documentElement.lang = '';
  });

  it('returns the default language (en) when nothing is stored', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.language).toBe('en');
  });

  it('exposes a setLanguage function', () => {
    const { result } = renderHook(() => useTranslation());
    expect(typeof result.current.setLanguage).toBe('function');
  });

  it('setLanguage updates the language state', () => {
    const { result } = renderHook(() => useTranslation());
    act(() => {
      result.current.setLanguage('hi');
    });
    expect(result.current.language).toBe('hi');
  });

  it('setLanguage updates the html lang attribute', () => {
    const { result } = renderHook(() => useTranslation());
    act(() => {
      result.current.setLanguage('ta');
    });
    expect(document.documentElement.lang).toBe('ta');
  });
});

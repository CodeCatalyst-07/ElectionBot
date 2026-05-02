/**
 * Smoke test for useAccessibility hook.
 * Verifies the hook initializes with default settings and
 * toggleSetting flips a single key correctly.
 */
import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from '../hooks/useAccessibility';

describe('useAccessibility', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns default settings on first render', () => {
    const { result } = renderHook(() => useAccessibility());
    expect(result.current.settings).toEqual({
      largerFont: false,
      highContrast: false,
      dyslexicFont: false,
      reducedMotion: false,
      screenReaderMode: false,
    });
  });

  it('exposes a toggleSetting function', () => {
    const { result } = renderHook(() => useAccessibility());
    expect(typeof result.current.toggleSetting).toBe('function');
  });

  it('toggleSetting flips a single setting from false to true', () => {
    const { result } = renderHook(() => useAccessibility());
    act(() => {
      result.current.toggleSetting('highContrast');
    });
    expect(result.current.settings.highContrast).toBe(true);
  });

  it('toggleSetting does not affect other settings', () => {
    const { result } = renderHook(() => useAccessibility());
    act(() => {
      result.current.toggleSetting('largerFont');
    });
    expect(result.current.settings.highContrast).toBe(false);
    expect(result.current.settings.dyslexicFont).toBe(false);
  });
});

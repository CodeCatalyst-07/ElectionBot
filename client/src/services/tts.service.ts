import apiClient from './api.service';
import { TTSResponse } from '../types/index';
import { TTS_LANG_CODES } from '../constants/index';

/**
 * Safely resolves a BCP-47 language code from the app's short language code.
 * Guarantees a valid string is always returned — never undefined.
 */
function resolveLanguageCode(language: string | null | undefined): string {
  if (!language || typeof language !== 'string') return 'en-IN';
  const code = TTS_LANG_CODES[language.trim()];
  return typeof code === 'string' && code.length > 0 ? code : 'en-IN';
}

/**
 * Converts text to speech audio using the backend (Google Cloud TTS).
 * Falls back to the browser's Web Speech API if the backend returns an error.
 * Fails silently and returns null on any unexpected error.
 *
 * @param text - The text to synthesize
 * @param language - Language code from the app's language selector (e.g. 'hi')
 * @returns A data URL for the MP3 audio, or null if synthesis failed completely
 */
export async function synthesizeSpeech(
  text: string | null | undefined,
  language: string | null | undefined,
): Promise<string | null> {
  // Guard: nothing to speak
  if (!text || typeof text !== 'string' || text.trim().length === 0) return null;

  const languageCode = resolveLanguageCode(language);

  try {
    const response = await apiClient.post<TTSResponse>('/tts', {
      text: text.trim(),
      languageCode,
    });

    const audioContent = response?.data?.audioContent;
    if (!audioContent || typeof audioContent !== 'string') {
      // Backend gave us nothing usable — fallback to browser TTS
      return useBrowserTTS(text, languageCode);
    }

    return `data:audio/mp3;base64,${audioContent}`;
  } catch {
    // 503 = TTS not configured, 429 = quota, etc. — always try browser fallback
    return useBrowserTTS(text, languageCode);
  }
}

/**
 * Falls back to the browser's Web Speech API for text-to-speech.
 * Returns null immediately since the browser handles playback directly.
 *
 * @param text - Text to speak aloud
 * @param langCode - BCP-47 language code for the voice (e.g. 'hi-IN')
 * @returns Always null — browser handles audio output directly
 */
function useBrowserTTS(text: string, langCode: string): null {
  try {
    if (!('speechSynthesis' in window)) return null;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = typeof langCode === 'string' && langCode.length > 0 ? langCode : 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Browser TTS unavailable or blocked — fail silently
  }
  return null;
}

/**
 * Stops any currently playing browser TTS audio.
 */
export function stopBrowserTTS(): void {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // Ignore — browser may not support this
  }
}

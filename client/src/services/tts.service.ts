import apiClient from './api.service';
import { TTSResponse } from '../types/index';
import { TTS_LANG_CODES } from '../constants/index';

/**
 * Converts text to speech audio using the backend (Google Cloud TTS).
 * Falls back to the browser's Web Speech API if the backend returns 503.
 *
 * @param text - The text to synthesize
 * @param language - Language code from the app's language selector (e.g. 'hi')
 * @returns A blob URL to the MP3 audio, or null if synthesis failed completely
 */
export async function synthesizeSpeech(text: string, language: string): Promise<string | null> {
  const languageCode = TTS_LANG_CODES[language] ?? 'en-IN';

  try {
    const response = await apiClient.post<TTSResponse>('/tts', { text, languageCode });
    const audioData = `data:audio/mp3;base64,${response.data.audioContent}`;
    return audioData;
  } catch {
    // 503 means Google TTS is not configured — use Web Speech API
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
  if (!('speechSynthesis' in window)) return null;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  return null;
}

/**
 * Stops any currently playing browser TTS audio.
 */
export function stopBrowserTTS(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

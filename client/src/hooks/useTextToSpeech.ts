import { useState, useCallback, useRef } from 'react';
import { synthesizeSpeech, stopBrowserTTS } from '../services/tts.service';

/**
 * Custom hook managing text-to-speech playback state.
 * All operations fail gracefully — a TTS error will never crash the app.
 *
 * @param language - Currently selected app language for voice selection
 * @returns Playing message ID, play handler, and stop handler
 */
export function useTextToSpeech(language: string | null | undefined): {
  playingMessageId: string | null;
  playMessage: (messageId: string, text: string) => Promise<void>;
  stopPlayback: () => void;
} {
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback((): void => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      stopBrowserTTS();
    } catch {
      // Ignore audio teardown errors
    } finally {
      setPlayingMessageId(null);
    }
  }, []);

  const playMessage = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      // Guard: bail out silently if inputs are invalid
      if (!messageId || typeof messageId !== 'string') return;
      if (!text || typeof text !== 'string' || text.trim().length === 0) return;

      // Stop any currently playing audio first
      stopPlayback();
      setPlayingMessageId(messageId);

      try {
        const audioSrc = await synthesizeSpeech(text, language ?? 'en');

        // synthesizeSpeech returns null when browser TTS is used
        if (!audioSrc) {
          // Poll until browser TTS finishes speaking, then clear state
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const checkInterval = setInterval(() => {
              try {
                if (!window.speechSynthesis.speaking) {
                  setPlayingMessageId(null);
                  clearInterval(checkInterval);
                }
              } catch {
                setPlayingMessageId(null);
                clearInterval(checkInterval);
              }
            }, 250);
          } else {
            setPlayingMessageId(null);
          }
          return;
        }

        // Play the MP3 data URL returned from Google Cloud TTS
        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        audio.onended = (): void => {
          setPlayingMessageId(null);
          audioRef.current = null;
        };
        audio.onerror = (): void => {
          setPlayingMessageId(null);
          audioRef.current = null;
        };

        await audio.play();
      } catch {
        // Any unexpected error — reset state, don't crash
        setPlayingMessageId(null);
        audioRef.current = null;
      }
    },
    [language, stopPlayback],
  );

  return { playingMessageId, playMessage, stopPlayback };
}

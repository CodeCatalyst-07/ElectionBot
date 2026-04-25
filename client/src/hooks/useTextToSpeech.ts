import { useState, useCallback, useRef } from 'react';
import { synthesizeSpeech, stopBrowserTTS } from '../services/tts.service';

/**
 * Custom hook managing text-to-speech playback state.
 * Tracks which message is currently playing, handles audio lifecycle.
 *
 * @param language - Currently selected app language for voice selection
 * @returns Playing message ID, play handler, and stop handler
 */
export function useTextToSpeech(language: string): {
  playingMessageId: string | null;
  playMessage: (messageId: string, text: string) => Promise<void>;
  stopPlayback: () => void;
} {
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    stopBrowserTTS();
    setPlayingMessageId(null);
  }, []);

  const playMessage = useCallback(
    async (messageId: string, text: string): Promise<void> => {
      // Stop any currently playing audio first
      stopPlayback();

      setPlayingMessageId(messageId);

      try {
        const audioSrc = await synthesizeSpeech(text, language);

        // If audioSrc is null, browser TTS was used — just clear state when done
        if (!audioSrc) {
          if ('speechSynthesis' in window) {
            const checkInterval = setInterval(() => {
              if (!window.speechSynthesis.speaking) {
                setPlayingMessageId(null);
                clearInterval(checkInterval);
              }
            }, 250);
          } else {
            setPlayingMessageId(null);
          }
          return;
        }

        // Play the MP3 returned from Google Cloud TTS
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
        setPlayingMessageId(null);
      }
    },
    [language, stopPlayback],
  );

  return { playingMessageId, playMessage, stopPlayback };
}

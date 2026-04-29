import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TTS_LANGUAGE_CODES } from '../utils/constants';
import logger from '../utils/logger';

/**
 * Google Cloud Text-to-Speech client instance.
 */
let ttsClient: TextToSpeechClient | null = null;

/**
 * Returns a singleton Google Cloud Text-to-Speech client.
 * Initializes the client on first call using the `GOOGLE_TTS_API_KEY`
 * environment variable. Subsequent calls reuse the same instance.
 *
 * @returns A configured TextToSpeechClient ready for synthesis requests
 */
function getTTSClient(): TextToSpeechClient {
  if (!ttsClient) {
    ttsClient = new TextToSpeechClient({
      apiKey: process.env.GOOGLE_TTS_API_KEY,
    });
  }
  return ttsClient;
}

/**
 * Selects the most natural-sounding TTS voice for a given language code.
 * Prefers WaveNet voices, falls back to Standard if WaveNet isn't available.
 *
 * @param languageCode - BCP-47 language code (e.g. 'en-IN', 'hi-IN')
 * @returns Voice configuration object for the TTS API
 */
function selectVoiceForLanguage(languageCode: string): {
  languageCode: string;
  name: string;
  ssmlGender: 'FEMALE' | 'MALE' | 'NEUTRAL';
} {
  const voiceMap: Record<string, { name: string; ssmlGender: 'FEMALE' | 'MALE' | 'NEUTRAL' }> = {
    'en-IN': { name: 'en-IN-Wavenet-D', ssmlGender: 'FEMALE' },
    'hi-IN': { name: 'hi-IN-Wavenet-D', ssmlGender: 'FEMALE' },
    'bn-IN': { name: 'bn-IN-Wavenet-A', ssmlGender: 'FEMALE' },
    'ta-IN': { name: 'ta-IN-Wavenet-A', ssmlGender: 'FEMALE' },
    'te-IN': { name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
    'mr-IN': { name: 'mr-IN-Wavenet-A', ssmlGender: 'FEMALE' },
    'gu-IN': { name: 'gu-IN-Wavenet-A', ssmlGender: 'FEMALE' },
  };

  const voice = voiceMap[languageCode] ?? { name: 'en-IN-Wavenet-D', ssmlGender: 'FEMALE' as const };
  return { languageCode, ...voice };
}

/**
 * Converts text to speech audio using Google Cloud Text-to-Speech API.
 * Returns the audio as a base64-encoded MP3 string.
 *
 * @param text - The text to synthesize (max 3,000 characters)
 * @param languageCode - BCP-47 language code (e.g. 'hi-IN', 'en-IN')
 * @returns Base64-encoded MP3 audio content
 * @throws Error if the API key is missing or the API call fails
 */
export async function synthesizeSpeech(text: string, languageCode: string): Promise<string> {
  if (!process.env.GOOGLE_TTS_API_KEY) {
    throw new Error('Google TTS API key not configured — client should use Web Speech API fallback');
  }

  const validCodes = Object.values(TTS_LANGUAGE_CODES);
  const resolvedCode = validCodes.includes(languageCode) ? languageCode : 'en-IN';

  logger.debug('Synthesizing speech', { languageCode: resolvedCode, textLength: text.length });

  const client = getTTSClient();
  const voice = selectVoiceForLanguage(resolvedCode);

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice,
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      pitch: 0,
      volumeGainDb: 0,
    },
  });

  if (!response.audioContent) {
    throw new Error('TTS API returned empty audio content');
  }

  let audioContent: string;
  if (response.audioContent instanceof Uint8Array) {
    audioContent = Buffer.from(response.audioContent).toString('base64');
  } else {
    // audioContent is already a string (base64) when returned from REST transport
    audioContent = Buffer.from(response.audioContent as unknown as string, 'binary').toString('base64');
  }

  logger.debug('Speech synthesis complete', { languageCode: resolvedCode });
  return audioContent;
}

import { Translate } from '@google-cloud/translate/build/src/v2/index.js';
import { SUPPORTED_LANGUAGES } from '../utils/constants';
import logger from '../utils/logger';

/**
 * Google Cloud Translation v2 client instance.
 * Initialized lazily so the server still starts if no key is configured.
 */
let translateClient: Translate | null = null;

function getTranslateClient(): Translate {
  if (!translateClient) {
    translateClient = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });
  }
  return translateClient;
}

/**
 * Translates a string of text into the specified target language using
 * Google Cloud Translation API v2.
 *
 * @param text - The source text to translate (max 5,000 characters)
 * @param targetLanguage - BCP-47 language code (e.g. 'hi', 'ta', 'bn')
 * @returns The translated text string
 * @throws Error if the target language is unsupported or the API call fails
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    logger.warn('Google Translate API key not configured — returning original text');
    return text;
  }

  if (!Object.keys(SUPPORTED_LANGUAGES).includes(targetLanguage)) {
    throw new Error(
      `Unsupported language code: ${targetLanguage}. Supported: ${Object.keys(SUPPORTED_LANGUAGES).join(', ')}`,
    );
  }

  // No need to translate if target is English
  if (targetLanguage === 'en') {
    return text;
  }

  logger.debug('Translating text', { targetLanguage, textLength: text.length });

  const client = getTranslateClient();
  const [translatedText] = await client.translate(text, targetLanguage);

  logger.debug('Translation complete', { targetLanguage });
  return translatedText;
}

/**
 * Translates multiple strings in a single batched API call for efficiency.
 *
 * @param texts - Array of strings to translate
 * @param targetLanguage - BCP-47 language code
 * @returns Array of translated strings in the same order as the input
 */
export async function translateBatch(texts: string[], targetLanguage: string): Promise<string[]> {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY || targetLanguage === 'en') {
    return texts;
  }

  const client = getTranslateClient();
  const [translations] = await client.translate(texts, targetLanguage);
  return Array.isArray(translations) ? translations : [translations];
}

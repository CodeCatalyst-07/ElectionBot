import apiClient from './api.service';
import { TranslateResponse } from '../types/index';

/** In-memory translation cache to avoid repeated identical API calls. */
const translationCache = new Map<string, string>();

/**
 * Builds a lightweight cache key for a translation request.
 * Uses only the first 100 characters of the text to keep keys short.
 *
 * @param text - The text being translated (e.g. an election FAQ answer)
 * @param targetLanguage - The BCP-47 target language code (e.g. 'hi', 'ta')
 * @returns A string in the format `"<lang>:<text_prefix>"` used as a Map key
 */
function buildCacheKey(text: string, targetLanguage: string): string {
  return `${targetLanguage}:${text.slice(0, 100)}`;
}

/**
 * Translates text to the target language via the backend proxy.
 * Results are cached in memory to reduce API calls for repeated translations.
 *
 * @param text - The text to translate
 * @param targetLanguage - BCP-47 language code (e.g. 'hi', 'ta')
 * @returns Translated text string, or original text if target is 'en'
 */
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'en') return text;

  // Guard: nothing to translate
  if (!text || text.trim().length === 0) return text;

  const cacheKey = buildCacheKey(text, targetLanguage);
  const cached = translationCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const response = await apiClient.post<TranslateResponse>('/translate', { text, targetLanguage });
  const translated = response.data.translatedText;

  translationCache.set(cacheKey, translated);
  return translated;
}

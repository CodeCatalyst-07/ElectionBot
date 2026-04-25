import apiClient from './api.service';
import { TranslateResponse } from '../types/index';

/** In-memory translation cache to avoid repeated identical API calls. */
const translationCache = new Map<string, string>();

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

  const cacheKey = buildCacheKey(text, targetLanguage);
  const cached = translationCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const response = await apiClient.post<TranslateResponse>('/translate', { text, targetLanguage });
  const translated = response.data.translatedText;

  translationCache.set(cacheKey, translated);
  return translated;
}

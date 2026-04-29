import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { SUPPORTED_LANGUAGES, TTS_LANGUAGE_CODES } from '../utils/constants';

/**
 * Sanitizes a raw string field by trimming whitespace, stripping HTML tags
 * to prevent XSS, and capping the length to a safe maximum.
 *
 * @param value - The raw string value received in a request body
 * @param maxLength - Maximum allowed character count (default: 2000)
 * @returns A trimmed, HTML-stripped, length-capped string
 */
function sanitizeString(value: string, maxLength = 2000): string {
  return value
    .trim()
    .replace(/<[^>]*>/g, '')
    .slice(0, maxLength);
}

/** Joi schema for POST /api/chat */
const chatSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  sessionId: Joi.string().max(128).required(),
  isFirstTimeVoter: Joi.boolean().required(),
  language: Joi.string()
    .valid(...Object.keys(SUPPORTED_LANGUAGES))
    .default('en'),
});

/** Joi schema for POST /api/translate */
const translateSchema = Joi.object({
  text: Joi.string().min(1).max(5000).required(),
  targetLanguage: Joi.string()
    .valid(...Object.keys(SUPPORTED_LANGUAGES))
    .required(),
});

/** Joi schema for POST /api/tts */
const ttsSchema = Joi.object({
  text: Joi.string().min(1).max(3000).required(),
  languageCode: Joi.string()
    .valid(...Object.values(TTS_LANGUAGE_CODES))
    .default('en-IN'),
});

/**
 * Creates an Express middleware that validates the request body against
 * the provided Joi schema, then sanitizes all string fields.
 *
 * Used to guard the `/api/chat`, `/api/translate`, and `/api/tts` endpoints
 * against malformed requests and injection payloads before they reach
 * the Gemini, Google Translate, or TTS service layers.
 *
 * @param schema - A Joi ObjectSchema describing the expected request shape
 * @returns Express middleware that validates, sanitizes, and passes or rejects the request
 */
function validateBody(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        error: error.details.map((d) => d.message).join('; '),
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      });
      return;
    }

    // Sanitize all string fields in the validated value
    if (typeof value === 'object' && value !== null) {
      for (const key of Object.keys(value as Record<string, unknown>)) {
        const fieldValue = (value as Record<string, unknown>)[key];
        if (typeof fieldValue === 'string') {
          (value as Record<string, unknown>)[key] = sanitizeString(fieldValue);
        }
      }
    }

    req.body = value;
    next();
  };
}

export const validateChatRequest = validateBody(chatSchema);
export const validateTranslateRequest = validateBody(translateSchema);
export const validateTTSRequest = validateBody(ttsSchema);

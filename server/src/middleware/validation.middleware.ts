import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { SUPPORTED_LANGUAGES, TTS_LANGUAGE_CODES } from '../utils/constants';

/** Sanitizes a string: trims whitespace, strips HTML tags, enforces max length. */
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
 * Validates request body against a Joi schema.
 * Sanitizes string fields to prevent injection attacks.
 * Returns 400 with a descriptive error if validation fails.
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

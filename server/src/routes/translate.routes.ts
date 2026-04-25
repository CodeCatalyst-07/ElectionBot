import { Router, Request, Response, NextFunction } from 'express';
import { validateTranslateRequest } from '../middleware/validation.middleware';
import { translateText } from '../services/translate.service';
import { TranslateRequest, TranslateResponse } from '../types/index';
import logger from '../utils/logger';

const router = Router();

/**
 * POST /api/translate
 * Accepts text and a target language code, returns the translated text.
 * Falls back to the original text if the Google Translate key is not configured.
 */
router.post(
  '/',
  validateTranslateRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { text, targetLanguage } = req.body as TranslateRequest;

    try {
      logger.debug('Translate request', { targetLanguage, textLength: text.length });

      const translatedText = await translateText(text, targetLanguage);
      const response: TranslateResponse = { translatedText };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

export default router;

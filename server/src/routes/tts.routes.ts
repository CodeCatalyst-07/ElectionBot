import { Router, Request, Response, NextFunction } from 'express';
import { validateTTSRequest } from '../middleware/validation.middleware';
import { synthesizeSpeech } from '../services/tts.service';
import { TTSRequest, TTSResponse } from '../types/index';
import logger from '../utils/logger';

const router = Router();

/**
 * POST /api/tts
 * Converts text to speech using Google Cloud TTS API.
 * Returns base64-encoded MP3 audio content.
 * If Google TTS is not configured, returns 503 so the client
 * knows to activate the Web Speech API browser fallback.
 */
router.post(
  '/',
  validateTTSRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { text, languageCode } = req.body as TTSRequest;

    try {
      logger.debug('TTS request', { languageCode, textLength: text.length });

      const audioContent = await synthesizeSpeech(text, languageCode);
      const response: TTSResponse = { audioContent, mimeType: 'audio/mp3' };
      res.status(200).json(response);
    } catch (error) {
      // If TTS not configured, signal client to use Web Speech API fallback
      if (error instanceof Error && error.message.includes('not configured')) {
        res.status(503).json({
          error: 'Google TTS not configured. Use browser Web Speech API.',
          code: 'TTS_NOT_CONFIGURED',
          statusCode: 503,
        });
        return;
      }
      next(error);
    }
  },
);

export default router;

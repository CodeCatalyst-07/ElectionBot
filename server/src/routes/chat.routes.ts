import { Router, Request, Response, NextFunction } from 'express';
import { chatRateLimiter } from '../middleware/rateLimit.middleware';
import { validateChatRequest } from '../middleware/validation.middleware';
import { sendChatMessage } from '../services/gemini.service';
import { getHistory, saveMessage } from '../services/firestore.service';
import { ChatRequest, ChatResponse, ChatMessage } from '../types/index';
import logger from '../utils/logger';

const router = Router();

/**
 * POST /api/chat
 * Accepts a user message, fetches session history from Firestore,
 * sends it to Gemini with the full conversation context, saves both
 * the user message and AI reply, and returns the response.
 */
router.post(
  '/',
  chatRateLimiter,
  validateChatRequest,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { message, sessionId, isFirstTimeVoter, language } = req.body as ChatRequest;

    try {
      logger.info('Chat request received', {
        sessionId,
        isFirstTimeVoter,
        language,
        messageLength: message.length,
      });

      // Load conversation history for this session
      const history = await getHistory(sessionId);

      // Call Gemini with history and new message
      const replyText = await sendChatMessage(history, message, isFirstTimeVoter);

      // Persist user message and AI reply to Firestore
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: Date.now(),
      };
      const modelMessage: ChatMessage = {
        role: 'model',
        content: replyText,
        timestamp: Date.now(),
      };

      await saveMessage(sessionId, userMessage);
      await saveMessage(sessionId, modelMessage);

      const response: ChatResponse = { reply: replyText, sessionId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

export default router;

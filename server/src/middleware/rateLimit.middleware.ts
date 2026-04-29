import rateLimit from 'express-rate-limit';
import {
  RATE_LIMIT_WINDOW_MS,
  CHAT_RATE_LIMIT_MAX,
  GENERAL_RATE_LIMIT_MAX,
  ERROR_CODES,
} from '../utils/constants';

/**
 * Rate limiter for the chat endpoint.
 * Allows a maximum of 20 requests per minute per IP address.
 * Returns a structured JSON error (not HTML) when the limit is exceeded.
 */
export const chatRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: CHAT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment before sending another message.',
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    statusCode: 429,
  },
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * General API rate limiter — 100 requests per minute per IP.
 * Applied to all other routes as a broad protection layer.
 */
export const generalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: GENERAL_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again shortly.',
    code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
    statusCode: 429,
  },
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

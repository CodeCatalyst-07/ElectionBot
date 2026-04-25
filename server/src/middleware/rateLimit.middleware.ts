import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for the chat endpoint.
 * Allows a maximum of 20 requests per minute per IP address.
 * Returns a structured JSON error (not HTML) when the limit is exceeded.
 */
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please wait a moment before sending another message.',
    code: 'RATE_LIMIT_EXCEEDED',
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
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests. Please try again shortly.',
    code: 'RATE_LIMIT_EXCEEDED',
    statusCode: 429,
  },
  handler: (_req, res, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

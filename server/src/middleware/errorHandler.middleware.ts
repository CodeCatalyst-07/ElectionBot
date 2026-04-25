import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Global error handler middleware.
 * Must be registered LAST in the Express middleware chain.
 * Returns a consistent JSON error shape for all unhandled errors.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Don't expose internal error details in production
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(500).json({
    error: isProduction
      ? 'An internal server error occurred. Please try again.'
      : err.message,
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  });
}

/**
 * 404 handler for unmatched routes.
 * Returns JSON (not HTML) so the frontend can handle it gracefully.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: `Route ${req.method} ${req.path} not found.`,
    code: 'NOT_FOUND',
    statusCode: 404,
  });
}

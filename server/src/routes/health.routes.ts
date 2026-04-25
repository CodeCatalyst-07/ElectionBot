import { Router, Request, Response } from 'express';
import admin from 'firebase-admin';

const router = Router();

/**
 * GET /api/health
 * Returns current service status for monitoring and deployment health checks.
 * Reports configuration status of each external service without exposing secrets.
 */
router.get('/', (_req: Request, res: Response): void => {
  const services = {
    gemini: !!process.env.GEMINI_API_KEY,
    translate: !!process.env.GOOGLE_TRANSLATE_API_KEY,
    tts: !!process.env.GOOGLE_TTS_API_KEY,
    calendar: !!(process.env.GOOGLE_CALENDAR_CLIENT_ID && process.env.GOOGLE_CALENDAR_CLIENT_SECRET),
    firebase: admin.apps.length > 0,
  };

  const allCriticalServicesUp = services.gemini;

  res.status(allCriticalServicesUp ? 200 : 503).json({
    status: allCriticalServicesUp ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '1.0.0',
    services,
    environment: process.env.NODE_ENV ?? 'development',
  });
});

export default router;

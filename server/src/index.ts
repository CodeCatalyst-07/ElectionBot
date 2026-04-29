import 'dotenv/config';
import express from 'express';
import { helmetMiddleware } from './middleware/helmet.middleware';
import { corsMiddleware } from './middleware/cors.middleware';
import { generalRateLimiter } from './middleware/rateLimit.middleware';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.middleware';
import chatRoutes from './routes/chat.routes';
import translateRoutes from './routes/translate.routes';
import ttsRoutes from './routes/tts.routes';
import calendarRoutes from './routes/calendar.routes';
import healthRoutes from './routes/health.routes';
import logger from './utils/logger';
import { DEFAULT_PORT, BODY_SIZE_LIMIT } from './utils/constants';

/**
 * Express application instance for the Election Assistant API.
 * All middleware, routes, and error handlers are registered on this object.
 */
const app = express();

/**
 * HTTP port the server listens on.
 * Defaults to 8080 to match Google Cloud Run's expected port.
 */
const PORT = parseInt(process.env.PORT ?? DEFAULT_PORT, 10);

// ─── Security Middleware ────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmetMiddleware);
app.use(corsMiddleware);

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: BODY_SIZE_LIMIT }));

// ─── General Rate Limiting ──────────────────────────────────────────────────
app.use('/api', generalRateLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/tts', ttsRoutes);
app.use('/api/calendar', calendarRoutes);

// ─── 404 + Global Error Handlers ────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
/**
 * Starts the HTTP server and logs a startup message.
 * In production, Cloud Run injects the PORT environment variable automatically.
 */
app.listen(PORT, () => {
  logger.info(`Election Assistant API running on port ${PORT}`, {
    environment: process.env.NODE_ENV ?? 'development',
    port: PORT,
  });
});

export default app;

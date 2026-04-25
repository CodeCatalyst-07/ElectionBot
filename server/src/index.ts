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

const app = express();
const PORT = parseInt(process.env.PORT ?? '8080', 10);

// ─── Security Middleware ────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmetMiddleware);
app.use(corsMiddleware);

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

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
app.listen(PORT, () => {
  logger.info(`Election Assistant API running on port ${PORT}`, {
    environment: process.env.NODE_ENV ?? 'development',
    port: PORT,
  });
});

export default app;

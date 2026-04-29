import cors from 'cors';
import { RequestHandler } from 'express';
import { DEFAULT_CLIENT_ORIGIN, ALT_DEV_ORIGIN } from '../utils/constants';

/**
 * CORS middleware allowing only the configured frontend origin.
 * Supports both development (localhost:5173) and production origins.
 */
export const corsMiddleware: RequestHandler = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_ORIGIN ?? DEFAULT_CLIENT_ORIGIN,
      DEFAULT_CLIENT_ORIGIN,
      ALT_DEV_ORIGIN,
    ];

    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}) as RequestHandler;

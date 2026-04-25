import winston from 'winston';

/**
 * Centralized Winston logger for the Election Assistant backend.
 * Outputs structured JSON in production, human-readable in development.
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
            return `${String(timestamp)} [${level}]: ${String(message)}${metaString}`;
          }),
        ),
  ),
  transports: [new winston.transports.Console()],
});

export default logger;

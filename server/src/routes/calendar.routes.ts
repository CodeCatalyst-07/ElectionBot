import { Router, Request, Response, NextFunction } from 'express';
import {
  getCalendarAuthUrl,
  exchangeCodeForTokens,
  addElectionEventsToCalendar,
} from '../services/calendar.service';
import { CountryContext } from '../types/index';
import logger from '../utils/logger';

const router = Router();

/**
 * GET /api/calendar/auth?country=india
 * Generates a Google OAuth2 authorization URL and redirects the user.
 * If Calendar credentials are not configured, returns 503 with a helpful message.
 */
router.get('/auth', (req: Request, res: Response): void => {
  const country = (req.query.country as CountryContext) ?? 'india';

  const authUrl = getCalendarAuthUrl(country);

  if (!authUrl) {
    res.status(503).json({
      error: 'Google Calendar integration is not configured yet. Coming soon!',
      code: 'CALENDAR_NOT_CONFIGURED',
      statusCode: 503,
    });
    return;
  }

  res.redirect(authUrl);
});

/**
 * GET /api/calendar/callback?code=...&state=india
 * OAuth2 callback endpoint. Exchanges the authorization code for tokens,
 * creates election events in Google Calendar, then redirects to the frontend.
 */
router.get('/callback', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { code, state } = req.query;
  const country = (state as CountryContext) ?? 'india';
  const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

  if (!code || typeof code !== 'string') {
    res.redirect(`${clientOrigin}?calendar=error&message=missing_code`);
    return;
  }

  try {
    logger.info('Calendar OAuth2 callback received', { country });

    const { access_token } = await exchangeCodeForTokens(code);

    if (!access_token) {
      throw new Error('OAuth2 token exchange returned no access token');
    }

    const eventCount = await addElectionEventsToCalendar(access_token, country);

    logger.info('Election events added to Calendar', { eventCount, country });
    res.redirect(`${clientOrigin}?calendar=success&events=${eventCount}`);
  } catch (error) {
    logger.error('Calendar callback error', { error });
    res.redirect(`${clientOrigin}?calendar=error&message=event_creation_failed`);
    next(error);
  }
});

export default router;

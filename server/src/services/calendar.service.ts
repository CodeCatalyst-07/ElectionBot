import { google } from 'googleapis';
import { CalendarEvent, CountryContext } from '../types/index';
import { INDIA_ELECTION_EVENTS, US_ELECTION_EVENTS } from '../utils/constants';
import logger from '../utils/logger';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

/**
 * Creates a configured OAuth2 client for Google Calendar access.
 * Returns null if Calendar credentials are not configured (graceful fallback).
 */
function createOAuth2Client(): InstanceType<typeof google.auth.OAuth2> | null {
  const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALENDAR_REDIRECT_URI ?? 'http://localhost:8080/api/calendar/callback';

  if (!clientId || !clientSecret) {
    logger.warn('Google Calendar OAuth2 credentials not configured');
    return null;
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generates the Google OAuth2 authorization URL for Calendar access.
 * The user will be redirected here to grant permission.
 *
 * @param country - The election country context ('india' or 'us')
 * @returns The OAuth2 authorization URL, or null if credentials aren't configured
 */
export function getCalendarAuthUrl(country: CountryContext): string | null {
  const oauth2Client = createOAuth2Client();
  if (!oauth2Client) return null;

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: country,
    prompt: 'consent',
  });

  return authUrl;
}

/**
 * Exchanges an OAuth2 authorization code for access and refresh tokens.
 *
 * @param code - The authorization code received from Google's OAuth2 callback
 * @returns Token credentials object
 * @throws Error if the token exchange fails
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string | null | undefined;
  refresh_token: string | null | undefined;
}> {
  const oauth2Client = createOAuth2Client();
  if (!oauth2Client) {
    throw new Error('Google Calendar credentials not configured');
  }

  const { tokens } = await oauth2Client.getToken(code);
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  };
}

/**
 * Creates a Google Calendar event with a reminder 3 days before the event.
 *
 * @param calendarApi - Authenticated Google Calendar API client
 * @param event - The election event data to create
 */
async function createCalendarEvent(
  calendarApi: ReturnType<typeof google.calendar>,
  event: CalendarEvent,
): Promise<void> {
  await calendarApi.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: event.summary,
      description: event.description,
      start: { date: event.startDate },
      end: { date: event.endDate },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: event.reminderDaysBefore * 24 * 60 },
          { method: 'popup', minutes: event.reminderDaysBefore * 24 * 60 },
        ],
      },
    },
  });
}

/**
 * Adds all election deadline events to the user's primary Google Calendar.
 * Creates 4 events (registration deadline, last campaign day, election day, results day)
 * each with a 3-day advance reminder.
 *
 * @param accessToken - OAuth2 access token obtained from the callback
 * @param country - Country context determining which set of events to create
 * @returns Number of events successfully created
 * @throws Error if any event creation fails
 */
export async function addElectionEventsToCalendar(
  accessToken: string,
  country: CountryContext,
): Promise<number> {
  const oauth2Client = createOAuth2Client();
  if (!oauth2Client) {
    throw new Error('Google Calendar credentials not configured');
  }

  oauth2Client.setCredentials({ access_token: accessToken });
  const calendarApi = google.calendar({ version: 'v3', auth: oauth2Client });

  const events = country === 'india' ? INDIA_ELECTION_EVENTS : US_ELECTION_EVENTS;

  logger.info('Adding election events to Google Calendar', { country, eventCount: events.length });

  let createdCount = 0;
  for (const event of events) {
    await createCalendarEvent(calendarApi, event);
    createdCount++;
    logger.debug('Created calendar event', { summary: event.summary });
  }

  return createdCount;
}

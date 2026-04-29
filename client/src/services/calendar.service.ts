import { CountryContext } from '../types/index';
import { CALENDAR_AUTH_PATH } from '../constants/index';

/**
 * Initiates the Google Calendar OAuth2 flow by navigating the user
 * to the backend's auth redirect endpoint.
 * If Calendar is not configured, the backend returns 503 and the
 * user sees a graceful "Coming Soon" message from the redirect.
 *
 * @param country - Which country's election events to add ('india' or 'us')
 */
export function initiateCalendarAuth(country: CountryContext): void {
  window.location.href = `${CALENDAR_AUTH_PATH}${country}`;
}

/**
 * Reads the ?calendar= query param set by the OAuth2 callback redirect
 * to determine whether Calendar event creation succeeded.
 *
 * @returns An object with status and optional event count
 */
export function readCalendarCallbackResult(): {
  status: 'success' | 'error' | 'none';
  eventCount?: number;
} {
  const params = new URLSearchParams(window.location.search);
  const calendarParam = params.get('calendar');

  if (calendarParam === 'success') {
    const events = params.get('events');
    return { status: 'success', eventCount: events ? parseInt(events, 10) : 4 };
  }
  if (calendarParam === 'error') {
    return { status: 'error' };
  }
  return { status: 'none' };
}

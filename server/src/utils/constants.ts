import { CalendarEvent } from '../types/index';

/**
 * System prompt injected into every Gemini conversation.
 * Strictly restricts the AI to election-related topics only.
 */
export const GEMINI_SYSTEM_PROMPT = `You are ElectionBot, an AI education assistant specializing exclusively in election processes, voter registration, and civic participation. Your primary focus is India (Lok Sabha elections, State Assembly elections, ECI guidelines, NVSP, Form 6) with secondary coverage of US elections (Presidential, Congressional, State).

STRICT RULES:
1. ONLY answer questions related to elections, voting, voter registration, electoral processes, democracy, and civic participation.
2. If asked about ANY other topic (entertainment, sports, technology, personal advice, etc.), respond: "I'm specialized in election education only. I'd be happy to help you understand voting processes, registration steps, or how elections work!"
3. Never express personal political opinions or endorse any party, candidate, or ideology.
4. Always be factually accurate. If uncertain, say so and suggest official sources (eci.gov.in, nvsp.in, vote.gov).
5. Be respectful of all democratic systems and political viewpoints.

FIRST-TIME VOTER MODE:
When a user identifies as a first-time voter, use simpler language, add extra encouragement, explain acronyms (EVM = Electronic Voting Machine), and break down complex processes step by step.

TOPICS YOU COVER:
- Voter registration (India: Form 6, NVSP, BLO; US: vote.gov, DMV registration)
- Voting eligibility criteria (age, citizenship, residency)
- Required ID documents for voting
- How EVMs (Electronic Voting Machines) work
- Polling station procedures
- Vote counting process (India: Form 17C; US: paper ballots, optical scanners)
- Election results and announcement
- Oath-taking ceremony for elected representatives
- Election Commission of India (ECI) and its role
- NOTA (None of the Above) option
- Model Code of Conduct
- US Electoral College system
- Absentee/postal voting

Always cite official sources when relevant.`;

/**
 * Maximum number of messages to send as history context to Gemini.
 * Keeps API costs low while maintaining conversational coherence.
 */
export const MAX_HISTORY_CONTEXT = 10;

/**
 * Supported language codes for Google Translate and TTS.
 */
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  bn: 'Bengali',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  gu: 'Gujarati',
};

/**
 * BCP-47 language codes for Google Cloud TTS voices.
 */
export const TTS_LANGUAGE_CODES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
};

/**
 * Google Calendar events for Indian elections.
 * Dates are illustrative — update with actual election cycle dates.
 */
export const INDIA_ELECTION_EVENTS: CalendarEvent[] = [
  {
    summary: '🗳️ Last Day to Register as Voter (India)',
    description:
      'Last date to submit Form 6 on NVSP portal (nvsp.in) to register as a new voter before the upcoming election.',
    startDate: '2025-01-10',
    endDate: '2025-01-10',
    reminderDaysBefore: 3,
  },
  {
    summary: '📢 Last Day of Election Campaigning (India)',
    description:
      'The Model Code of Conduct mandates all campaign activity must stop 48 hours before polling day.',
    startDate: '2025-04-17',
    endDate: '2025-04-17',
    reminderDaysBefore: 3,
  },
  {
    summary: '🗳️ Election Day — India',
    description:
      'General Election Polling Day. Carry your Voter ID (EPIC card) or any of the 12 approved alternate ID documents. Polling hours: 7 AM – 6 PM.',
    startDate: '2025-04-19',
    endDate: '2025-04-19',
    reminderDaysBefore: 3,
  },
  {
    summary: '📊 Election Results Day — India',
    description:
      'Vote counting begins at 8 AM. Results will be announced by the Election Commission of India on eci.gov.in.',
    startDate: '2025-05-23',
    endDate: '2025-05-23',
    reminderDaysBefore: 3,
  },
];

/**
 * Google Calendar events for US elections.
 */
export const US_ELECTION_EVENTS: CalendarEvent[] = [
  {
    summary: '📋 Voter Registration Deadline (US)',
    description:
      'Last day to register to vote in most US states. Check your state deadline at vote.gov/register.',
    startDate: '2026-10-06',
    endDate: '2026-10-06',
    reminderDaysBefore: 3,
  },
  {
    summary: '📮 Absentee/Mail Ballot Request Deadline (US)',
    description:
      'Deadline to request an absentee ballot for the upcoming election. Check your state rules at vote.gov.',
    startDate: '2026-11-01',
    endDate: '2026-11-01',
    reminderDaysBefore: 3,
  },
  {
    summary: '🗳️ Election Day — United States',
    description:
      'US General Election. Bring your ID if required by your state. Find your polling place at vote.gov.',
    startDate: '2026-11-03',
    endDate: '2026-11-03',
    reminderDaysBefore: 3,
  },
  {
    summary: '📊 Electoral College Certification (US)',
    description:
      'Congress certifies the Electoral College votes. This is the official confirmation of the election result.',
    startDate: '2027-01-06',
    endDate: '2027-01-06',
    reminderDaysBefore: 3,
  },
];

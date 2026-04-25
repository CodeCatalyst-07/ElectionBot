/**
 * Shared TypeScript interfaces for the Election Assistant server.
 * Every API request and response is typed here — no `any` usage.
 */

/** Represents a single message in a chat conversation. */
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

/** Body payload for POST /api/chat */
export interface ChatRequest {
  message: string;
  sessionId: string;
  isFirstTimeVoter: boolean;
  language: string;
}

/** Body payload for POST /api/translate */
export interface TranslateRequest {
  text: string;
  targetLanguage: string;
}

/** Body payload for POST /api/tts */
export interface TTSRequest {
  text: string;
  languageCode: string;
}

/** Response shape returned from POST /api/chat */
export interface ChatResponse {
  reply: string;
  sessionId: string;
}

/** Response shape returned from POST /api/translate */
export interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

/** Response shape returned from POST /api/tts */
export interface TTSResponse {
  audioContent: string;
  mimeType: string;
}

/** A Google Calendar event to be created */
export interface CalendarEvent {
  summary: string;
  description: string;
  startDate: string;
  endDate: string;
  reminderDaysBefore: number;
}

/** Stored Firestore document shape for a chat session */
export interface FirestoreSession {
  sessionId: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

/** Standard error response shape */
export interface ErrorResponse {
  error: string;
  code: string;
  statusCode: number;
}

/** Country context for election data */
export type CountryContext = 'india' | 'us';

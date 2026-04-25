/** Shared TypeScript interfaces for the Election Assistant frontend. */

export type MessageRole = 'user' | 'model';

/** A single chat message displayed in the chatbot UI. */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  isPlaying?: boolean;
}

/** State managed by the useChat hook. */
export interface ChatState {
  messages: ChatMessage[];
  sessionId: string;
  isLoading: boolean;
  error: string | null;
}

/** Accessibility settings stored in localStorage. */
export interface AccessibilitySettings {
  largerFont: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
}

/** A single question in the election knowledge quiz. */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  country: 'india' | 'us' | 'both';
}

/** User's answer to a quiz question. */
export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

/** A stage in the election timeline. */
export interface TimelineStage {
  id: string;
  title: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  keyFacts: string[];
  duration: string;
  country: 'india' | 'us';
}

/** A step in the voter guide wizard. */
export interface VoterGuideStep {
  id: number;
  title: string;
  icon: string;
  description: string;
  standardTips: string[];
  firstTimerTips: string[];
  links?: { label: string; url: string; country: 'india' | 'us' | 'both' }[];
}

/** A supported translation language. */
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
}

/** Badge earned after completing the quiz. */
export interface QuizBadge {
  title: string;
  emoji: string;
  description: string;
  minScore: number;
}

/** Country context for timeline and voter guide. */
export type CountryContext = 'india' | 'us';

/** Response from POST /api/chat */
export interface ChatResponse {
  reply: string;
  sessionId: string;
}

/** Response from POST /api/translate */
export interface TranslateResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
}

/** Response from POST /api/tts */
export interface TTSResponse {
  audioContent: string;
  mimeType: string;
}

/** API error response shape. */
export interface ApiError {
  error: string;
  code: string;
  statusCode: number;
}

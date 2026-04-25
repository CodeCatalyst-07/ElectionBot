import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { ChatMessage } from '../types/index';
import { GEMINI_SYSTEM_PROMPT, MAX_HISTORY_CONTEXT } from '../utils/constants';
import logger from '../utils/logger';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

/**
 * Converts stored Firestore ChatMessage objects into the Content format
 * required by the Gemini SDK for multi-turn conversation history.
 *
 * @param messages - Array of stored chat messages from Firestore
 * @returns Array of Gemini-compatible Content objects
 */
function convertMessagesToGeminiHistory(messages: ChatMessage[]): Content[] {
  return messages.map((msg) => ({
    role: msg.role,
    parts: [{ text: msg.content }],
  }));
}

/**
 * Appends a first-time voter prefix to the system prompt when the user
 * has identified themselves as a first-time voter.
 *
 * @param isFirstTimeVoter - Whether to enable first-time voter mode
 * @returns Modified system prompt string
 */
function buildSystemPrompt(isFirstTimeVoter: boolean): string {
  if (!isFirstTimeVoter) return GEMINI_SYSTEM_PROMPT;

  const firstTimePrefix = `\n\nFIRST-TIME VOTER MODE ACTIVE: This user is a first-time voter. 
Use simpler language, avoid jargon, spell out all acronyms on first use (e.g., EVM = Electronic Voting Machine), 
add extra encouragement and positive reinforcement, and break complex multi-step processes into numbered lists.`;

  return GEMINI_SYSTEM_PROMPT + firstTimePrefix;
}

/**
 * Sends a user message to the Gemini 1.5 Flash model with full conversation
 * history for contextual multi-turn responses.
 *
 * @param history - Previous messages in this session (capped at MAX_HISTORY_CONTEXT)
 * @param userMessage - The new message from the user
 * @param isFirstTimeVoter - Whether to activate first-time voter mode
 * @returns The model's text response
 * @throws Error if the Gemini API call fails or returns an empty response
 */
export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
  isFirstTimeVoter: boolean,
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
    systemInstruction: buildSystemPrompt(isFirstTimeVoter),
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
      topP: 0.9,
    },
  });

  // Use only the last MAX_HISTORY_CONTEXT messages to keep costs low
  const recentHistory = history.slice(-MAX_HISTORY_CONTEXT);
  const geminiHistory = convertMessagesToGeminiHistory(recentHistory);

  logger.debug('Sending message to Gemini', {
    historyLength: geminiHistory.length,
    isFirstTimeVoter,
    messagePreview: userMessage.slice(0, 50),
  });

  const chat = model.startChat({ history: geminiHistory });
  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  const text = response.text();

  if (!text || text.trim().length === 0) {
    throw new Error('Gemini returned an empty response');
  }

  logger.debug('Received Gemini response', { responseLength: text.length });
  return text;
}

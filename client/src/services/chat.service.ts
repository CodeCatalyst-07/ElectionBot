import apiClient from './api.service';
import { ChatResponse } from '../types/index';

/**
 * Sends a chat message to the backend, which calls Gemini AI.
 *
 * @param message - The user's question text
 * @param sessionId - Unique session identifier for conversation history
 * @param isFirstTimeVoter - Whether first-time voter mode is active
 * @param language - BCP-47 language code for the response language
 * @returns The AI reply text and confirmed sessionId
 */
export async function sendMessage(
  message: string,
  sessionId: string,
  isFirstTimeVoter: boolean,
  language: string,
): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>('/chat', {
    message,
    sessionId,
    isFirstTimeVoter,
    language,
  });
  return response.data;
}

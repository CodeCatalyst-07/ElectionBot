/**
 * Unit tests for gemini.service.ts
 * Mocks the @google/generative-ai SDK to avoid real API calls.
 */

// Mock must be declared before imports
jest.mock('@google/generative-ai', () => {
  const mockSendMessage = jest.fn();
  const mockStartChat = jest.fn(() => ({ sendMessage: mockSendMessage }));
  const mockGetGenerativeModel = jest.fn(() => ({ startChat: mockStartChat }));

  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: mockGetGenerativeModel,
    })),
    __mockSendMessage: mockSendMessage,
    __mockGetGenerativeModel: mockGetGenerativeModel,
  };
});

import { sendChatMessage } from '../services/gemini.service';
import { ChatMessage } from '../types/index';

// Access the mock reference after jest.mock hoisting
const geminiModule = jest.requireMock('@google/generative-ai') as {
  __mockSendMessage: jest.Mock;
  __mockGetGenerativeModel: jest.Mock;
};

describe('gemini.service', () => {
  const mockHistory: ChatMessage[] = [
    { role: 'user', content: 'What is voter registration?', timestamp: 1000 },
    { role: 'model', content: 'Voter registration is...', timestamp: 1001 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('returns the model response text for a valid election question', async () => {
    geminiModule.__mockSendMessage.mockResolvedValueOnce({
      response: { text: () => 'To register to vote in India, visit nvsp.in and fill Form 6.' },
    });

    const result = await sendChatMessage(mockHistory, 'How do I register to vote in India?', false);

    expect(result).toBe('To register to vote in India, visit nvsp.in and fill Form 6.');
    expect(geminiModule.__mockSendMessage).toHaveBeenCalledTimes(1);
  });

  it('throws an error when Gemini API key is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(
      sendChatMessage([], 'What is an EVM?', false),
    ).rejects.toThrow('Gemini API key is not configured');
  });

  it('uses the correct system prompt variant when isFirstTimeVoter is true', async () => {
    geminiModule.__mockSendMessage.mockResolvedValueOnce({
      response: { text: () => 'Welcome! As a first-time voter, here is how you register...' },
    });

    const result = await sendChatMessage([], 'How do I vote?', true);

    expect(result).toContain('first-time voter');
    // Verify getGenerativeModel was called — the system instruction is passed to it
    expect(geminiModule.__mockGetGenerativeModel).toHaveBeenCalledWith(
      expect.objectContaining({
        systemInstruction: expect.stringContaining('FIRST-TIME VOTER MODE ACTIVE'),
      }),
    );
  });

  it('throws when Gemini returns an empty response text', async () => {
    geminiModule.__mockSendMessage.mockResolvedValueOnce({
      response: { text: () => '' },
    });

    await expect(
      sendChatMessage(mockHistory, 'What is EVM?', false),
    ).rejects.toThrow('Gemini returned an empty response');
  });
});

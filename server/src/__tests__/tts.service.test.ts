/**
 * Unit tests for tts.service.ts
 * Mocks the @google-cloud/text-to-speech SDK to avoid real API calls.
 */

const mockSynthesizeSpeech = jest.fn();

jest.mock('@google-cloud/text-to-speech', () => ({
  TextToSpeechClient: jest.fn(() => ({ synthesizeSpeech: mockSynthesizeSpeech })),
}));

import { synthesizeSpeech } from '../services/tts.service';

describe('tts.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_TTS_API_KEY = 'test-tts-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_TTS_API_KEY;
  });

  it('returns base64-encoded audio content for valid input', async () => {
    const fakeAudio = Buffer.from('fake-mp3-audio-data');
    mockSynthesizeSpeech.mockResolvedValueOnce([{ audioContent: fakeAudio }]);

    const result = await synthesizeSpeech('How do I register to vote?', 'en-IN');

    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(mockSynthesizeSpeech).toHaveBeenCalledTimes(1);
  });

  it('throws an error when Google TTS API key is not configured', async () => {
    delete process.env.GOOGLE_TTS_API_KEY;

    await expect(synthesizeSpeech('Vote today!', 'hi-IN')).rejects.toThrow(
      'Google TTS API key not configured',
    );
    expect(mockSynthesizeSpeech).not.toHaveBeenCalled();
  });

  it('throws when the API returns empty audio content', async () => {
    mockSynthesizeSpeech.mockResolvedValueOnce([{ audioContent: null }]);

    await expect(synthesizeSpeech('Election Day is important!', 'hi-IN')).rejects.toThrow(
      'TTS API returned empty audio content',
    );
  });
});

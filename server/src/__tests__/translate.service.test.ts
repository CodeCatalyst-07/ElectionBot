/**
 * Unit tests for translate.service.ts
 * Mocks the @google-cloud/translate SDK to avoid real API calls.
 */

jest.mock('@google-cloud/translate/build/src/v2/index.js', () => {
  const mockTranslate = jest.fn();
  return {
    Translate: jest.fn(() => ({ translate: mockTranslate })),
    __mockTranslate: mockTranslate,
  };
});

import { translateText, translateBatch } from '../services/translate.service';

const translateModule = jest.requireMock(
  '@google-cloud/translate/build/src/v2/index.js',
) as { __mockTranslate: jest.Mock };

describe('translate.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_TRANSLATE_API_KEY = 'test-translate-key';
  });

  afterEach(() => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
  });

  it('returns the translated text for a supported language', async () => {
    translateModule.__mockTranslate.mockResolvedValueOnce(['मतदाता पंजीकरण क्या है?', {}]);

    const result = await translateText('What is voter registration?', 'hi');

    expect(result).toBe('मतदाता पंजीकरण क्या है?');
    expect(translateModule.__mockTranslate).toHaveBeenCalledWith(
      'What is voter registration?',
      'hi',
    );
  });

  it('returns original text without API call when target language is English', async () => {
    const result = await translateText('How do I vote?', 'en');

    expect(result).toBe('How do I vote?');
    expect(translateModule.__mockTranslate).not.toHaveBeenCalled();
  });

  it('returns original text when API key is not configured', async () => {
    delete process.env.GOOGLE_TRANSLATE_API_KEY;

    const result = await translateText('Voter registration steps', 'hi');

    expect(result).toBe('Voter registration steps');
    expect(translateModule.__mockTranslate).not.toHaveBeenCalled();
  });

  it('throws an error for an unsupported language code', async () => {
    await expect(translateText('Hello', 'xx')).rejects.toThrow('Unsupported language code: xx');
  });

  it('translates a batch of strings in a single call', async () => {
    translateModule.__mockTranslate.mockResolvedValueOnce([
      ['अपना वोट डालें', 'पंजीकरण करें'],
      {},
    ]);

    const result = await translateBatch(['Cast your vote', 'Register'], 'hi');

    expect(result).toEqual(['अपना वोट डालें', 'पंजीकरण करें']);
    expect(translateModule.__mockTranslate).toHaveBeenCalledTimes(1);
  });
});

/**
 * Unit tests for client/src/utils/quizUtils.ts
 */
import { calculateScore, getBadge, shuffleQuestions, calculatePercentage } from '../utils/quizUtils';
import { QuizAnswer, QuizQuestion } from '../types/index';

const mockAnswers: QuizAnswer[] = [
  { questionId: 'q1', selectedIndex: 1, isCorrect: true },
  { questionId: 'q2', selectedIndex: 1, isCorrect: true },
  { questionId: 'q3', selectedIndex: 0, isCorrect: false },
  { questionId: 'q4', selectedIndex: 1, isCorrect: true },
];

const mockQuestion: QuizQuestion = {
  id: 'q1',
  question: 'Test question?',
  options: ['A', 'B', 'C', 'D'],
  correctIndex: 1,
  explanation: 'Test explanation.',
  country: 'india',
};

describe('calculateScore', () => {
  it('counts only correct answers', () => {
    expect(calculateScore(mockAnswers)).toBe(3);
  });

  it('returns 0 for an empty answers array', () => {
    expect(calculateScore([])).toBe(0);
  });

  it('returns the full count when all answers are correct', () => {
    const allCorrect: QuizAnswer[] = Array.from({ length: 5 }, (_, i) => ({
      questionId: `q${i}`,
      selectedIndex: 0,
      isCorrect: true,
    }));
    expect(calculateScore(allCorrect)).toBe(5);
  });
});

describe('getBadge', () => {
  it('returns "Informed Voter" badge for score >= 8', () => {
    expect(getBadge(8).title).toBe('Informed Voter');
    expect(getBadge(10).title).toBe('Informed Voter');
  });

  it('returns "Civic Champion" badge for score 6–7', () => {
    expect(getBadge(6).title).toBe('Civic Champion');
    expect(getBadge(7).title).toBe('Civic Champion');
  });

  it('returns "Democracy Learner" badge for score 4–5', () => {
    expect(getBadge(4).title).toBe('Democracy Learner');
    expect(getBadge(5).title).toBe('Democracy Learner');
  });

  it('returns "First-Time Explorer" badge for score 0–3', () => {
    expect(getBadge(0).title).toBe('First-Time Explorer');
    expect(getBadge(3).title).toBe('First-Time Explorer');
  });
});

describe('shuffleQuestions', () => {
  it('returns the same number of questions', () => {
    const questions = Array.from({ length: 10 }, (_, i) => ({ ...mockQuestion, id: `q${i}` }));
    const shuffled = shuffleQuestions(questions);
    expect(shuffled).toHaveLength(10);
  });

  it('does not mutate the original array', () => {
    const original = [{ ...mockQuestion, id: 'q1' }, { ...mockQuestion, id: 'q2' }];
    const originalCopy = [...original];
    shuffleQuestions(original);
    expect(original).toEqual(originalCopy);
  });

  it('contains all the same questions after shuffling', () => {
    const questions = Array.from({ length: 5 }, (_, i) => ({ ...mockQuestion, id: `q${i}` }));
    const shuffled = shuffleQuestions(questions);
    const originalIds = questions.map((q) => q.id).sort();
    const shuffledIds = shuffled.map((q) => q.id).sort();
    expect(shuffledIds).toEqual(originalIds);
  });
});

describe('calculatePercentage', () => {
  it('returns 80 for 8 out of 10', () => {
    expect(calculatePercentage(8, 10)).toBe(80);
  });

  it('returns 0 when total is 0 (no division by zero)', () => {
    expect(calculatePercentage(0, 0)).toBe(0);
  });

  it('rounds to the nearest integer', () => {
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

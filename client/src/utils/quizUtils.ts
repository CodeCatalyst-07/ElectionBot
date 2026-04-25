import { QuizAnswer, QuizBadge, QuizQuestion } from '../types/index';
import { QUIZ_BADGES } from '../constants/index';

/**
 * Calculates the total number of correct answers in a quiz session.
 *
 * @param answers - Array of the user's quiz answers
 * @returns Number of correct answers
 */
export function calculateScore(answers: QuizAnswer[]): number {
  return answers.filter((answer) => answer.isCorrect).length;
}

/**
 * Returns the appropriate badge based on the user's score.
 * Evaluates badge thresholds in descending order.
 *
 * @param score - The number of correct answers
 * @returns The highest-tier QuizBadge the score qualifies for
 */
export function getBadge(score: number): QuizBadge {
  const sortedBadges = [...QUIZ_BADGES].sort((a, b) => b.minScore - a.minScore);
  const badge = sortedBadges.find((b) => score >= b.minScore);
  return badge ?? QUIZ_BADGES[QUIZ_BADGES.length - 1] ?? { title: 'Participant', emoji: '🌱', description: 'Thanks for playing!', minScore: 0 };
}

/**
 * Returns a new shuffled copy of the quiz questions array using Fisher-Yates.
 * Does not mutate the original array.
 *
 * @param questions - The original ordered quiz questions
 * @returns A new array with questions in random order
 */
export function shuffleQuestions(questions: QuizQuestion[]): QuizQuestion[] {
  const copy = [...questions];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    const item = copy[j];
    if (temp !== undefined && item !== undefined) {
      copy[i] = item;
      copy[j] = temp;
    }
  }
  return copy;
}

/**
 * Calculates the score percentage as a whole number.
 *
 * @param score - Number of correct answers
 * @param total - Total number of questions
 * @returns Percentage rounded to the nearest integer
 */
export function calculatePercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

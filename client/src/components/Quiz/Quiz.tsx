import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '../../constants/index';
import { QuizAnswer, QuizQuestion } from '../../types/index';
import { shuffleQuestions, calculateScore, getBadge } from '../../utils/quizUtils';
import QuizQuestionCard from './QuizQuestion';
import QuizResult from './QuizResult';

/**
 * Quiz container managing question state, answers, progress bar, and result display.
 * Handles question shuffling and score calculation.
 */
export default function Quiz(): JSX.Element {
  const [questions] = useState<QuizQuestion[]>(() => shuffleQuestions(QUIZ_QUESTIONS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const handleAnswer = useCallback(
    (selectedIndex: number): void => {
      const isCorrect = selectedIndex === currentQuestion.correctIndex;
      const answer: QuizAnswer = {
        questionId: currentQuestion.id,
        selectedIndex,
        isCorrect,
      };
      setAnswers((prev) => [...prev, answer]);
    },
    [currentQuestion],
  );

  const handleNext = useCallback((): void => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, questions.length]);

  const handleRestart = useCallback((): void => {
    setIsRestarting(true);
    setTimeout(() => {
      setAnswers([]);
      setCurrentIndex(0);
      setIsFinished(false);
      setIsRestarting(false);
    }, 300);
  }, []);

  const score = calculateScore(answers);
  const badge = getBadge(score);
  const currentAnswer = answers[currentIndex] ?? null;

  if (isFinished && !isRestarting) {
    return <QuizResult score={score} total={questions.length} badge={badge} onRestart={handleRestart} answers={answers} questions={questions} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{score} correct so far</span>
        </div>
        <div
          className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentIndex + 1}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-label={`Question ${currentIndex + 1} of ${questions.length}`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-civic-blue-500 to-civic-blue-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        {!isRestarting && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <QuizQuestionCard
              question={currentQuestion}
              answer={currentAnswer}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLast={currentIndex === questions.length - 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

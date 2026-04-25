import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion, QuizAnswer } from '../../types/index';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  answer: QuizAnswer | null;
  onAnswer: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

/**
 * Renders a single quiz question with 4 multiple-choice options.
 * After answering, shows correct/incorrect feedback and explanation.
 */
export default function QuizQuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  isLast,
}: QuizQuestionCardProps): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isAnswered = answer !== null;

  const getOptionStyle = (index: number): string => {
    const base = 'w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-sm';
    if (!isAnswered) {
      return hoveredIndex === index
        ? `${base} border-civic-blue-300 bg-civic-blue-50 text-civic-blue-800`
        : `${base} border-gray-200 bg-white text-gray-700 hover:border-civic-blue-300 hover:bg-civic-blue-50`;
    }
    if (index === question.correctIndex) {
      return `${base} border-green-500 bg-green-50 text-green-800`;
    }
    if (index === answer.selectedIndex && !answer.isCorrect) {
      return `${base} border-red-400 bg-red-50 text-red-800`;
    }
    return `${base} border-gray-200 bg-gray-50 text-gray-400`;
  };

  const getOptionIcon = (index: number): string => {
    if (!isAnswered) return OPTION_LABELS[index] ?? '';
    if (index === question.correctIndex) return '✓';
    if (index === answer?.selectedIndex && !answer.isCorrect) return '✗';
    return OPTION_LABELS[index] ?? '';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Question header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            question.country === 'india' ? 'bg-saffron/10 text-orange-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {question.country === 'india' ? '🇮🇳 India' : '🇺🇸 United States'}
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Answer options */}
      <div className="px-6 py-4 space-y-2.5">
        {question.options.map((option, index) => (
          <button
            key={option}
            onClick={() => !isAnswered && onAnswer(index)}
            onMouseEnter={() => !isAnswered && setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            disabled={isAnswered}
            className={getOptionStyle(index)}
            aria-label={`Option ${OPTION_LABELS[index]}: ${option}${isAnswered && index === question.correctIndex ? ' (correct)' : ''}${isAnswered && index === answer?.selectedIndex && !answer.isCorrect ? ' (your answer — incorrect)' : ''}`}
          >
            <span className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
              isAnswered && index === question.correctIndex ? 'bg-green-500 text-white' :
              isAnswered && index === answer?.selectedIndex && !answer.isCorrect ? 'bg-red-500 text-white' :
              'bg-gray-100 text-gray-600'
            }`} aria-hidden="true">
              {getOptionIcon(index)}
            </span>
            <span className="flex-1 leading-snug">{option}</span>
          </button>
        ))}
      </div>

      {/* Explanation + Next button */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`mx-6 mb-4 rounded-xl p-4 ${answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">
                {answer.isCorrect ? '✅ Correct!' : '❌ Not quite'}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
            <div className="px-6 pb-5">
              <button
                onClick={onNext}
                className="w-full bg-civic-blue-600 hover:bg-civic-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
                aria-label={isLast ? 'See your final score' : 'Next question'}
              >
                {isLast ? '🏆 See my score' : 'Next question →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

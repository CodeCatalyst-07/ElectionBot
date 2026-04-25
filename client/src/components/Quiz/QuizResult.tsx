import { motion } from 'framer-motion';
import { QuizBadge, QuizAnswer, QuizQuestion } from '../../types/index';

interface QuizResultProps {
  score: number;
  total: number;
  badge: QuizBadge;
  onRestart: () => void;
  answers: QuizAnswer[];
  questions: QuizQuestion[];
}

/**
 * Final quiz result screen with animated badge, score bar, share button, and answer review.
 */
export default function QuizResult({
  score, total, badge, onRestart, answers, questions,
}: QuizResultProps): JSX.Element {
  const percentage = Math.round((score / total) * 100);

  const handleShare = (): void => {
    const text = `I scored ${score}/${total} on the ElectionBot Quiz and earned the "${badge.title}" badge! 🗳️`;
    void navigator.clipboard?.writeText(text);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6"
      >
        <div className="bg-gradient-to-br from-civic-blue-700 to-civic-blue-900 px-6 py-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="text-7xl mb-3"
            role="img"
            aria-label={`Badge: ${badge.title}`}
          >
            {badge.emoji}
          </motion.div>
          <h2 className="text-2xl font-bold mb-1">{badge.title}</h2>
          <p className="text-blue-200 text-sm">{badge.description}</p>
        </div>

        <div className="px-6 py-6 text-center">
          <div className="text-5xl font-bold text-civic-blue-700 mb-1">
            {score}/{total}
          </div>
          <p className="text-gray-500 text-sm mb-4">You answered {percentage}% correctly</p>

          <div
            className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Score: ${percentage}%`}
          >
            <motion.div
              className={`h-full rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-amber-500' : 'bg-red-400'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </div>

          <button
            onClick={onRestart}
            className="w-full bg-civic-blue-600 hover:bg-civic-blue-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
            aria-label="Retake the quiz"
          >
            🔄 Retake Quiz
          </button>
          <button
            onClick={handleShare}
            className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors text-sm"
            aria-label="Copy quiz result to clipboard"
          >
            📋 Copy my score
          </button>
        </div>
      </motion.div>

      {/* Answer review */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Answer Review</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {questions.map((question, index) => {
            const answer = answers[index];
            const isCorrect = answer?.isCorrect ?? false;
            return (
              <div key={question.id} className="px-6 py-4 flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  aria-hidden="true"
                >
                  {isCorrect ? '✓' : '✗'}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-0.5">{question.question}</p>
                  {!isCorrect && (
                    <p className="text-xs text-gray-500">
                      Correct: <span className="text-green-700 font-medium">{question.options[question.correctIndex]}</span>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

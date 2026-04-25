import { motion } from 'framer-motion';
import { SUGGESTED_QUESTIONS } from '../../constants/index';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  compact?: boolean;
}

/**
 * Displays a grid of clickable suggested question chips for new users.
 * Compact mode shows fewer chips inline with existing messages.
 */
export default function SuggestedQuestions({
  onSelect,
  compact = false,
}: SuggestedQuestionsProps): JSX.Element {
  const displayedQuestions = compact ? SUGGESTED_QUESTIONS.slice(0, 3) : SUGGESTED_QUESTIONS;

  return (
    <div
      className={compact ? 'flex flex-wrap gap-2' : 'grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto'}
      role="list"
      aria-label="Suggested questions"
    >
      {displayedQuestions.map((question, index) => (
        <motion.button
          key={question}
          role="listitem"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelect(question)}
          className={`text-left text-sm text-civic-blue-700 bg-civic-blue-50 hover:bg-civic-blue-100 border border-civic-blue-200 rounded-xl px-3 py-2 transition-all hover:shadow-sm hover:-translate-y-0.5 duration-150 ${
            compact ? 'text-xs' : ''
          }`}
          aria-label={`Ask: ${question}`}
        >
          {!compact && <span className="mr-1.5 text-civic-blue-400" aria-hidden="true">💬</span>}
          {question}
        </motion.button>
      ))}
    </div>
  );
}

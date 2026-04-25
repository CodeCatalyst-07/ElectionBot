import { motion, AnimatePresence } from 'framer-motion';
import { TimelineStage } from '../../types/index';

interface TimelineStageCardProps {
  stage: TimelineStage;
  index: number;
  isExpanded: boolean;
  isLast: boolean;
  onClick: () => void;
}

/**
 * A single clickable stage card in the election timeline.
 * Expands to reveal full description and key facts on click.
 */
export default function TimelineStageCard({
  stage,
  index,
  isExpanded,
  onClick,
}: TimelineStageCardProps): JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative flex gap-4"
    >
      {/* Stage number circle */}
      <div
        className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-sm transition-all duration-200 ${
          isExpanded
            ? 'bg-civic-blue-600 text-white scale-110'
            : 'bg-white border-2 border-civic-blue-200 text-civic-blue-700'
        }`}
        aria-hidden="true"
      >
        {stage.icon}
      </div>

      {/* Card */}
      <div className="flex-1 min-w-0 pb-3">
        <button
          onClick={onClick}
          className={`w-full text-left rounded-xl border transition-all duration-200 overflow-hidden ${
            isExpanded
              ? 'border-civic-blue-300 shadow-md bg-white'
              : 'border-gray-200 bg-white hover:border-civic-blue-200 hover:shadow-sm'
          }`}
          aria-expanded={isExpanded}
          aria-controls={`stage-detail-${stage.id}`}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Stage {index + 1}: {stage.title}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {stage.duration}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5 truncate">{stage.shortDescription}</p>
            </div>
            <span
              className={`text-gray-400 text-xs transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              ▾
            </span>
          </div>

          {/* Expanded content */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id={`stage-detail-${stage.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {stage.fullDescription}
                  </p>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Key Facts
                    </h4>
                    <ul className="space-y-1.5">
                      {stage.keyFacts.map((fact) => (
                        <li key={fact} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-civic-blue-500 mt-0.5 flex-shrink-0" aria-hidden="true">✓</span>
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}

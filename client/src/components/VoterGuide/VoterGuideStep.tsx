import { AnimatePresence, motion } from 'framer-motion';
import { VoterGuideStep } from '../../types/index';

interface VoterGuideStepCardProps {
  step: VoterGuideStep;
  isFirstTimeVoter: boolean;
}

/**
 * Displays a single voter guide step with standard tips and
 * optionally first-time voter bonus tips based on the toggle.
 */
export default function VoterGuideStepCard({ step, isFirstTimeVoter }: VoterGuideStepCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-civic-blue-600 to-civic-blue-700 px-6 py-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl" role="img" aria-label={step.title}>{step.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{step.title}</h2>
            <p className="text-blue-200 text-sm">{step.description}</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5">
        {/* Standard tips */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            What you need to know
          </h3>
          <ul className="space-y-2.5">
            {step.standardTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-civic-blue-100 text-civic-blue-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5" aria-hidden="true">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* First-time voter tips (conditional) */}
        <AnimatePresence>
          {isFirstTimeVoter && step.firstTimerTips.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span aria-hidden="true">🌱</span> First-time voter tips
                </h3>
                <ul className="space-y-2">
                  {step.firstTimerTips.map((tip) => (
                    <li key={tip} className="text-sm text-amber-800 leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helpful links */}
        {step.links && step.links.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Useful links
            </h3>
            <div className="flex flex-wrap gap-2">
              {step.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-civic-blue-600 hover:text-civic-blue-800 bg-civic-blue-50 hover:bg-civic-blue-100 border border-civic-blue-200 rounded-lg px-3 py-1.5 transition-colors"
                  aria-label={`${link.label} — opens in a new tab`}
                >
                  {link.country === 'india' ? '🇮🇳' : link.country === 'us' ? '🇺🇸' : '🌐'}
                  {link.label}
                  <span className="text-xs text-gray-400" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

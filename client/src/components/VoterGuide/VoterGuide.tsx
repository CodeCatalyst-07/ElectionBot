import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VOTER_GUIDE_STEPS } from '../../constants/index';
import VoterGuideStepCard from './VoterGuideStep';

/**
 * 6-step voter guide wizard with progress bar and first-time voter toggle.
 * Navigation: Previous / Next buttons with step counter.
 */
export default function VoterGuide(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFirstTimeVoter, setIsFirstTimeVoter] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const totalSteps = VOTER_GUIDE_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const step = VOTER_GUIDE_STEPS[currentStep];

  const handleNext = (): void => {
    if (currentStep < totalSteps - 1) {
      setDirection('forward');
      setCurrentStep((p) => p + 1);
    }
  };

  const handlePrev = (): void => {
    if (currentStep > 0) {
      setDirection('back');
      setCurrentStep((p) => p - 1);
    }
  };

  const slideVariants = {
    enter: { opacity: 0, x: direction === 'forward' ? 40 : -40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'forward' ? -40 : 40 },
  };

  if (!step) return <div />;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* First-time voter toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Step {currentStep + 1} of {totalSteps}
        </h2>
        <button
          onClick={() => setIsFirstTimeVoter((p) => !p)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
            isFirstTimeVoter
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
          }`}
          aria-pressed={isFirstTimeVoter}
          aria-label="Toggle first-time voter tips"
        >
          <span aria-hidden="true">🌱</span>
          First-time voter tips
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div
          className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-civic-blue-500 to-civic-green-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between mt-3" aria-hidden="true">
          {VOTER_GUIDE_STEPS.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {
                setDirection(index > currentStep ? 'forward' : 'back');
                setCurrentStep(index);
              }}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all duration-200 ${
                index === currentStep
                  ? 'bg-civic-blue-600 text-white scale-110 shadow-md'
                  : index < currentStep
                  ? 'bg-civic-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
              aria-label={`Go to step ${index + 1}: ${s.title}`}
              aria-current={index === currentStep ? 'step' : undefined}
            >
              {index < currentStep ? '✓' : index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentStep}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <VoterGuideStepCard step={step} isFirstTimeVoter={isFirstTimeVoter} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
          aria-label="Go to previous step"
        >
          ← Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-civic-blue-600 text-white hover:bg-civic-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-semibold"
          aria-label={currentStep === totalSteps - 1 ? 'You have completed the voter guide' : 'Go to next step'}
        >
          {currentStep === totalSteps - 1 ? '✅ Complete!' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

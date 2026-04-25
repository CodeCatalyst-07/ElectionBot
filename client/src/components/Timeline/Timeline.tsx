import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INDIA_TIMELINE_STAGES, US_TIMELINE_STAGES } from '../../constants/index';
import { CountryContext } from '../../types/index';
import TimelineStageCard from './TimelineStage';

/**
 * Interactive election timeline with India/US tabs.
 * Clicking a stage expands it to show full details and key facts.
 */
export default function Timeline(): JSX.Element {
  const [activeCountry, setActiveCountry] = useState<CountryContext>('india');
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  const stages = activeCountry === 'india' ? INDIA_TIMELINE_STAGES : US_TIMELINE_STAGES;

  const handleStageClick = (stageId: string): void => {
    setExpandedStageId((prev) => (prev === stageId ? null : stageId));
  };

  return (
    <div className="w-full">
      {/* Country Tabs */}
      <div className="flex items-center gap-2 mb-8" role="tablist" aria-label="Select country election timeline">
        {(
          [
            { key: 'india', label: '🇮🇳 India', subtitle: 'Lok Sabha & State Elections' },
            { key: 'us', label: '🇺🇸 United States', subtitle: 'Presidential & Congressional' },
          ] as { key: CountryContext; label: string; subtitle: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={activeCountry === tab.key}
            aria-controls={`timeline-panel-${tab.key}`}
            onClick={() => {
              setActiveCountry(tab.key);
              setExpandedStageId(null);
            }}
            className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeCountry === tab.key
                ? 'bg-civic-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-civic-blue-300 hover:text-civic-blue-700'
            }`}
          >
            <div className="font-semibold">{tab.label}</div>
            <div className={`text-xs mt-0.5 ${activeCountry === tab.key ? 'text-blue-200' : 'text-gray-400'}`}>
              {tab.subtitle}
            </div>
          </button>
        ))}
      </div>

      {/* Timeline stages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCountry}
          id={`timeline-panel-${activeCountry}`}
          role="tabpanel"
          aria-label={`${activeCountry === 'india' ? 'India' : 'US'} election timeline`}
          initial={{ opacity: 0, x: activeCountry === 'india' ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Vertical connector line */}
          <div
            className="absolute left-5 top-10 bottom-10 w-0.5 bg-gradient-to-b from-civic-blue-400 via-civic-blue-200 to-transparent hidden sm:block"
            aria-hidden="true"
          />

          <div className="space-y-3">
            {stages.map((stage, index) => (
              <TimelineStageCard
                key={stage.id}
                stage={stage}
                index={index}
                isExpanded={expandedStageId === stage.id}
                isLast={index === stages.length - 1}
                onClick={() => handleStageClick(stage.id)}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

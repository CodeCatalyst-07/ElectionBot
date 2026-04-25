import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AccessibilitySettings } from '../../types/index';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onToggle: (key: keyof AccessibilitySettings) => void;
}

const ACCESSIBILITY_OPTIONS: {
  key: keyof AccessibilitySettings;
  label: string;
  description: string;
  icon: string;
}[] = [
  { key: 'largerFont', label: 'Larger Text', description: 'Increase font size across the app', icon: 'A' },
  { key: 'highContrast', label: 'High Contrast', description: 'Sharpen colors for better visibility', icon: '◐' },
  { key: 'dyslexicFont', label: 'Dyslexia-Friendly Font', description: 'Switch to OpenDyslexic font', icon: 'Aa' },
  { key: 'reducedMotion', label: 'Reduce Motion', description: 'Disable animations and transitions', icon: '⏸' },
  { key: 'screenReaderMode', label: 'Screen Reader Mode', description: 'Enhance ARIA labels and descriptions', icon: '👁' },
];

/**
 * Floating accessibility settings panel anchored to the bottom-right corner.
 * All settings persist in localStorage via the useAccessibility hook.
 */
export default function AccessibilityPanel({ settings, onToggle }: AccessibilityPanelProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-72 overflow-hidden"
            role="dialog"
            aria-label="Accessibility settings"
            aria-modal="false"
          >
            <div className="px-4 py-3 border-b border-gray-100 bg-civic-blue-600 text-white">
              <h2 className="font-semibold text-sm">Accessibility Settings</h2>
              <p className="text-blue-200 text-xs mt-0.5">Settings are saved automatically</p>
            </div>

            <div className="p-3 space-y-2">
              {ACCESSIBILITY_OPTIONS.map((option) => {
                const isActive = settings[option.key];
                return (
                  <button
                    key={option.key}
                    onClick={() => onToggle(option.key)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      isActive
                        ? 'bg-civic-blue-50 border-civic-blue-200'
                        : 'bg-gray-50 border-transparent hover:border-gray-200'
                    }`}
                    role="switch"
                    aria-checked={isActive}
                    aria-label={`${option.label}: ${isActive ? 'on' : 'off'}`}
                  >
                    <span
                      className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isActive ? 'bg-civic-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                      aria-hidden="true"
                    >
                      {option.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${isActive ? 'text-civic-blue-800' : 'text-gray-700'}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{option.description}</div>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 relative ${isActive ? 'bg-civic-blue-600' : 'bg-gray-300'}`}
                      aria-hidden="true"
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0.5'}`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center text-xl transition-all duration-200 relative ${
          isOpen ? 'bg-civic-blue-700 text-white' : 'bg-white text-civic-blue-600 border border-gray-200 hover:border-civic-blue-300'
        }`}
        aria-label={`${isOpen ? 'Close' : 'Open'} accessibility settings panel`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        ♿
        {activeCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-white text-xs font-bold rounded-full flex items-center justify-center"
            aria-label={`${activeCount} accessibility features active`}
          >
            {activeCount}
          </span>
        )}
      </button>
    </div>
  );
}

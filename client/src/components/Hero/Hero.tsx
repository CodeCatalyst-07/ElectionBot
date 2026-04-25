import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * Hero section for the homepage.
 * Features animated headline, CTAs, and a decorative civic illustration.
 */
export default function Hero(): JSX.Element {
  return (
    <section
      className="relative hero-gradient overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="hero-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20" aria-hidden="true" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-civic-blue-400/20 rounded-full blur-2xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6"
            >
              <span role="img" aria-hidden="true">🤖</span>
              <span>Powered by Google Gemini AI</span>
            </motion.div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Understand{' '}
              <span className="text-yellow-300">Elections</span>
              <br />
              Like Never Before
            </h1>

            <p className="text-blue-100 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Your AI-powered guide to voter registration, EVM processes, election timelines, and
              civic participation — in India and the USA.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-white text-civic-blue-800 px-6 py-3.5 rounded-xl font-semibold text-base hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                aria-label="Start chatting with ElectionBot AI"
              >
                <span role="img" aria-hidden="true">💬</span>
                Ask ElectionBot
              </Link>
              <Link
                to="/voter-guide"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-6 py-3.5 rounded-xl font-semibold text-base hover:bg-white/20 transition-all duration-200"
                aria-label="View step-by-step voter guide"
              >
                <span role="img" aria-hidden="true">📖</span>
                Voter Guide
              </Link>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/20">
              {[
                { value: '7', label: 'Languages' },
                { value: '10', label: 'Quiz Questions' },
                { value: '6', label: 'Voter Guide Steps' },
                { value: '2', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Decorative card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="relative w-full max-w-sm">
              {/* Main card */}
              <div className="glass-card rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-civic-blue-600 rounded-full flex items-center justify-center text-xl">🤖</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">ElectionBot</div>
                    <div className="text-xs text-civic-green-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-civic-green-500 rounded-full inline-block"></span>
                      Online
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-civic-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm ml-8">
                    How do I register to vote?
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-gray-700 mr-8">
                    To register in India, visit nvsp.in and fill Form 6. You'll need your age proof and address proof. Your EPIC card arrives in 30–60 days! 🗳️
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {['Register now', 'What ID do I need?'].map((chip) => (
                    <span key={chip} className="text-xs bg-civic-blue-50 text-civic-blue-700 px-3 py-1 rounded-full border border-civic-blue-100">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 rounded-2xl px-3 py-1.5 text-xs font-bold shadow-lg">
                🏆 Informed Voter
              </div>
              <div className="absolute -bottom-4 -left-4 bg-civic-green-600 text-white rounded-2xl px-3 py-1.5 text-xs font-bold shadow-lg">
                🇮🇳 India + 🇺🇸 US
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

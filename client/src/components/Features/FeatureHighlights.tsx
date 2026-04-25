import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Election Assistant',
    description: 'Ask anything about Indian or US elections. Gemini AI answers with accurate, source-backed information.',
    link: '/chat',
    linkLabel: 'Start chatting',
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: '📅',
    title: 'Election Timeline',
    description: 'Visualise every stage of an election — from announcement to oath-taking — for India and the USA.',
    link: '/timeline',
    linkLabel: 'Explore timeline',
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: '📖',
    title: 'Step-by-Step Voter Guide',
    description: 'A 6-step wizard walking you through eligibility, registration, polling day, and beyond.',
    link: '/voter-guide',
    linkLabel: 'Read the guide',
    color: 'from-green-500 to-green-700',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: '🧠',
    title: 'Interactive Quiz',
    description: '10 election knowledge questions covering India and the US. Earn badges and track your civic IQ.',
    link: '/quiz',
    linkLabel: 'Take the quiz',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Feature highlights grid displayed on the homepage below the hero section.
 */
export default function FeatureHighlights(): JSX.Element {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Everything You Need to{' '}
            <span className="text-civic-blue-600">Vote Informed</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From first-time voters to civic enthusiasts — ElectionBot makes democracy education
            accessible, engaging, and multilingual.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className={`group relative rounded-2xl border ${feature.border} ${feature.bg} p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl shadow-md mb-4`}
                aria-hidden="true"
              >
                {feature.icon}
              </div>

              <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{feature.description}</p>

              <Link
                to={feature.link}
                className="inline-flex items-center gap-1 text-sm font-semibold text-civic-blue-600 hover:text-civic-blue-800 group-hover:gap-2 transition-all duration-200"
                aria-label={`${feature.linkLabel} — ${feature.title}`}
              >
                {feature.linkLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

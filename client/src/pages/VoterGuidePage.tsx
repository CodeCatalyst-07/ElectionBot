import VoterGuide from '../components/VoterGuide/VoterGuide';
import Timeline from '../components/Timeline/Timeline';

/**
 * Full-page Voter Guide + Timeline combined view.
 * The voter guide wizard is the primary content; timeline is below.
 */
export default function VoterGuidePage(): JSX.Element {
  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      {/* Voter Guide */}
      <section aria-labelledby="voter-guide-heading" className="max-w-3xl mx-auto mb-20">
        <div className="text-center mb-10">
          <h1 id="voter-guide-heading" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            📖 Step-by-Step Voter Guide
          </h1>
          <p className="text-gray-500 text-lg">
            A complete walkthrough from eligibility to results — for India and the USA.
          </p>
        </div>
        <VoterGuide />
      </section>

      {/* Election Timeline */}
      <section aria-labelledby="timeline-heading" className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="timeline-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            📅 Election Timeline
          </h2>
          <p className="text-gray-500">Explore every stage of the election process.</p>
        </div>
        <Timeline />
      </section>
    </main>
  );
}

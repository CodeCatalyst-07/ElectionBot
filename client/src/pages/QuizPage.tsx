import Quiz from '../components/Quiz/Quiz';

/**
 * Full-page Quiz view with page header.
 */
export default function QuizPage(): JSX.Element {
  return (
    <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50" aria-label="Election knowledge quiz">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            🧠 Election Knowledge Quiz
          </h1>
          <p className="text-gray-500 text-lg">
            Test your knowledge of Indian and US election processes. Earn a badge based on your score!
          </p>
        </div>
        <Quiz />
      </div>
    </main>
  );
}

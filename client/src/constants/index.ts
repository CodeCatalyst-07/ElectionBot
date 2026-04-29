import {
  QuizQuestion,
  TimelineStage,
  VoterGuideStep,
  SupportedLanguage,
  QuizBadge,
} from '../types/index';

/** Backend API base URL (proxied through Vite in dev) */
export const API_BASE_URL = '/api';

/**
 * Production backend API base URL (Google Cloud Run).
 * Used by the Axios client in api.service.ts.
 */
export const BACKEND_API_URL = 'https://election-assistant-server-154633889700.us-central1.run.app/api';

/**
 * localStorage key for persisting the user's accessibility settings
 * (high contrast, dyslexic font, larger text, reduced motion, screen reader).
 */
export const ACCESSIBILITY_STORAGE_KEY = 'election-bot-accessibility';

/**
 * localStorage key for persisting the user's selected UI language
 * across browser sessions.
 */
export const LANGUAGE_STORAGE_KEY = 'election-bot-language';

/**
 * Default language code shown when the user has not yet selected a language.
 * English is used as the fallback for all election content.
 */
export const DEFAULT_LANGUAGE = 'en';

/**
 * Base path for initiating Google Calendar OAuth2 for election event creation.
 * Appended with the country context (e.g. 'india' or 'us').
 */
export const CALENDAR_AUTH_PATH = '/api/calendar/auth?country=';

/** Suggested questions shown to new chatbot users */
export const SUGGESTED_QUESTIONS: string[] = [
  'How do I register to vote in India?',
  'What ID do I need on election day?',
  'How are votes counted in India?',
  'What is an EVM and how does it work?',
  'How does the US Electoral College work?',
  'What is NOTA?',
  'Who is eligible to vote in India?',
  'What is the Model Code of Conduct?',
];

/** Supported translation languages */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
];

/** TTS language code map matching supported languages */
export const TTS_LANG_CODES: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
};

/** Quiz badges based on score thresholds */
export const QUIZ_BADGES: QuizBadge[] = [
  { title: 'Informed Voter', emoji: '🏆', description: 'You aced the election quiz!', minScore: 8 },
  { title: 'Civic Champion', emoji: '🥈', description: 'Great knowledge of the electoral process!', minScore: 6 },
  { title: 'Democracy Learner', emoji: '🎓', description: 'A good start — keep learning!', minScore: 4 },
  { title: 'First-Time Explorer', emoji: '🌱', description: 'Every expert was once a beginner!', minScore: 0 },
];

/** All 10 quiz questions */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'At what age are Indian citizens eligible to vote?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correctIndex: 1,
    explanation: 'The 61st Amendment to the Indian Constitution (1988) lowered the voting age from 21 to 18 years.',
    country: 'india',
  },
  {
    id: 'q2',
    question: 'What does EVM stand for in Indian elections?',
    options: ['Election Verification Machine', 'Electronic Voting Machine', 'Electoral Vote Monitor', 'Electronic Voter Mechanism'],
    correctIndex: 1,
    explanation: 'EVM stands for Electronic Voting Machine. India started using EVMs in 1982 and went fully electronic in 2004.',
    country: 'india',
  },
  {
    id: 'q3',
    question: 'Which form must a first-time voter fill to register in India?',
    options: ['Form 7', 'Form 8', 'Form 6', 'Form 1'],
    correctIndex: 2,
    explanation: 'Form 6 is submitted on the NVSP (nvsp.in) portal or physically at your local BLO to register as a new voter.',
    country: 'india',
  },
  {
    id: 'q4',
    question: 'What is NOTA in Indian elections?',
    options: ['National Online Total Accounting', 'None of the Above', 'Nominated Official Total Area', 'National Order to Abstain'],
    correctIndex: 1,
    explanation: 'NOTA (None of the Above) was introduced in Indian elections in 2013 following a Supreme Court order, allowing voters to reject all candidates.',
    country: 'india',
  },
  {
    id: 'q5',
    question: 'Which body conducts elections in India?',
    options: ['Supreme Court of India', 'Parliament of India', 'Election Commission of India', 'Ministry of Home Affairs'],
    correctIndex: 2,
    explanation: 'The Election Commission of India (ECI), established in 1950, is an autonomous constitutional authority responsible for administering all elections.',
    country: 'india',
  },
  {
    id: 'q6',
    question: 'How many electors are in the US Electoral College for presidential elections?',
    options: ['435', '538', '500', '270'],
    correctIndex: 1,
    explanation: 'There are 538 electors in the Electoral College. A presidential candidate needs 270 electoral votes to win.',
    country: 'us',
  },
  {
    id: 'q7',
    question: 'In India, what is the Model Code of Conduct (MCC)?',
    options: ['A law passed by Parliament', 'ECI guidelines for parties and candidates during elections', 'A Supreme Court ruling', 'A voter ID rule'],
    correctIndex: 1,
    explanation: 'The MCC is a set of guidelines issued by the ECI that political parties and candidates must follow during election campaigns to ensure free and fair elections.',
    country: 'india',
  },
  {
    id: 'q8',
    question: 'In the US, on which day are federal elections traditionally held?',
    options: ['First Monday in November', 'First Tuesday after the first Monday in November', 'Last Tuesday of October', 'Second Wednesday in November'],
    correctIndex: 1,
    explanation: 'Since 1845, US federal elections are held on the first Tuesday after the first Monday in November — commonly called "Election Day."',
    country: 'us',
  },
  {
    id: 'q9',
    question: 'What is a VVPAT machine used for in Indian elections?',
    options: ['Voter verification at registration', 'Printing voter ID cards', 'Paper audit trail to verify EVM vote', 'Video surveillance of polling booths'],
    correctIndex: 2,
    explanation: 'VVPAT (Voter Verifiable Paper Audit Trail) prints a paper slip showing the symbol of the party voted for, allowing voters to verify their vote before the slip drops into a sealed compartment.',
    country: 'india',
  },
  {
    id: 'q10',
    question: 'Which of these is NOT an approved ID document for voting in India?',
    options: ['Aadhaar Card', 'EPIC (Voter ID Card)', 'Driving Licence', 'Student Identity Card from private college'],
    correctIndex: 3,
    explanation: 'The ECI accepts 12 documents including EPIC, Aadhaar, Passport, Driving Licence, PAN Card, and others. A general private college student ID is not on the approved list.',
    country: 'india',
  },
];

/** Indian election timeline stages */
export const INDIA_TIMELINE_STAGES: TimelineStage[] = [
  {
    id: 'india-announcement',
    title: 'Election Announcement',
    icon: '📢',
    shortDescription: 'ECI announces election schedule',
    fullDescription: 'The Election Commission of India announces the election schedule, dates for polling, and triggers the Model Code of Conduct (MCC). This freezes new government schemes and transfers.',
    keyFacts: ['MCC comes into force immediately', 'Can span multiple phases for Lok Sabha', 'State governments lose ability to announce new policies'],
    duration: '1 day',
    country: 'india',
  },
  {
    id: 'india-nomination',
    title: 'Nomination Filing',
    icon: '📝',
    shortDescription: 'Candidates file nomination papers',
    fullDescription: 'Candidates file nomination papers at the Returning Officer\'s office. Nominations are scrutinized and candidates may withdraw within a specified period.',
    keyFacts: ['Security deposit required (₹25,000 for General, ₹12,500 for SC/ST)', 'Nominees must be 25+ for Lok Sabha', 'Last date for withdrawal is 2 weeks before polling'],
    duration: '2–4 weeks',
    country: 'india',
  },
  {
    id: 'india-campaigning',
    title: 'Election Campaigning',
    icon: '🗣️',
    shortDescription: 'Parties campaign for votes',
    fullDescription: 'Political parties and candidates campaign across constituencies. The MCC governs conduct. Campaigning must stop 48 hours before polling day (the "silent period").',
    keyFacts: ['Campaign expenditure limits apply', 'Paid news is prohibited', 'Silent period: 48 hours before polling'],
    duration: '4–8 weeks',
    country: 'india',
  },
  {
    id: 'india-polling',
    title: 'Polling Day',
    icon: '🗳️',
    shortDescription: 'Citizens cast their votes',
    fullDescription: 'Registered voters visit their assigned polling booth, show approved ID, and cast their vote on the EVM. Polls are open 7 AM to 6 PM. A VVPAT slip confirms the vote.',
    keyFacts: ['Carry EPIC card or 12 approved alternate IDs', 'Indelible ink marked on left index finger', 'VVPAT slip visible for 7 seconds'],
    duration: '1 day per phase',
    country: 'india',
  },
  {
    id: 'india-counting',
    title: 'Vote Counting',
    icon: '📊',
    shortDescription: 'Votes tallied at counting centres',
    fullDescription: 'EVMs are transported to counting centres under strict security. Counting begins at 8 AM on the designated counting day. Results are declared constituency by constituency.',
    keyFacts: ['Counting agents from each party are present', 'EVM results cross-referenced with Form 17C', 'Election Commission declares official results on eci.gov.in'],
    duration: '1 day',
    country: 'india',
  },
  {
    id: 'india-results',
    title: 'Results & Winner Declaration',
    icon: '🏆',
    shortDescription: 'Winning candidates declared',
    fullDescription: 'Returning Officers declare winners in each constituency. The party or alliance with a majority in Lok Sabha forms the government. The President invites the majority leader to form government.',
    keyFacts: ['272+ seats needed for majority in 543-seat Lok Sabha', 'Coalition government possible if no single majority', 'Governor invites state majority leader for state assemblies'],
    duration: '1 day',
    country: 'india',
  },
  {
    id: 'india-oath',
    title: 'Oath Taking',
    icon: '🎖️',
    shortDescription: 'Elected representatives sworn in',
    fullDescription: 'The President administers the oath of office to the Prime Minister and Cabinet. MPs are sworn in by the Speaker of the Lok Sabha. Government officially takes charge.',
    keyFacts: ['PM sworn in by President at Rashtrapati Bhavan', 'MPs take oath in Hindi, English, or their mother tongue', 'New government can immediately begin governance'],
    duration: '1–2 days',
    country: 'india',
  },
];

/** US election timeline stages */
export const US_TIMELINE_STAGES: TimelineStage[] = [
  {
    id: 'us-primaries',
    title: 'Primary Elections',
    icon: '🗳️',
    shortDescription: 'Parties select their candidates',
    fullDescription: 'Political parties hold primary elections or caucuses to select their presidential and congressional nominees. Rules vary by state and party.',
    keyFacts: ['Open vs. closed primaries differ by state', 'Super Tuesday is a major primary day', 'Delegates are allocated to candidates'],
    duration: 'Feb–June',
    country: 'us',
  },
  {
    id: 'us-conventions',
    title: 'Party Conventions',
    icon: '📢',
    shortDescription: 'Parties formally nominate candidates',
    fullDescription: 'National party conventions formally nominate presidential and vice-presidential candidates. Delegates ratify the primary results and parties adopt their platforms.',
    keyFacts: ['Democratic and Republican conventions held separately', 'Vice-presidential nominee announced', 'Party platform adopted'],
    duration: '4 days each',
    country: 'us',
  },
  {
    id: 'us-campaigning',
    title: 'General Election Campaign',
    icon: '🗣️',
    shortDescription: 'Candidates campaign nationwide',
    fullDescription: 'Presidential and congressional candidates campaign across the country. Presidential debates are held. Campaign finance rules apply under the FEC.',
    keyFacts: ['3 presidential debates typically held', 'FEC regulates campaign spending', 'Electoral College strategy drives campaigning'],
    duration: 'July–November',
    country: 'us',
  },
  {
    id: 'us-voting',
    title: 'Election Day',
    icon: '🇺🇸',
    shortDescription: 'Americans cast their votes',
    fullDescription: 'Registered voters cast ballots on the first Tuesday after the first Monday in November. Methods include in-person voting, mail-in ballots, and early voting (varies by state).',
    keyFacts: ['Not a federal holiday (though some states observe it)', 'Absentee/mail voting available in all states', 'Polls close at varying times by state'],
    duration: '1 day',
    country: 'us',
  },
  {
    id: 'us-counting',
    title: 'Vote Counting & Certification',
    icon: '📊',
    shortDescription: 'States count and certify results',
    fullDescription: 'States count ballots and certify results. This can take days or weeks depending on mail-in ballot volume. States then certify their results and appoint electors.',
    keyFacts: ['States have different certification deadlines', 'Recounts can be triggered automatically or requested', 'Each state appoints Electoral College electors'],
    duration: 'Days to weeks',
    country: 'us',
  },
  {
    id: 'us-electoral-college',
    title: 'Electoral College Vote',
    icon: '🏛️',
    shortDescription: 'Electors cast official presidential votes',
    fullDescription: 'In mid-December, 538 electors in state capitals cast their official votes for President and Vice President. A candidate needs 270 electoral votes to win.',
    keyFacts: ['538 total electors (= 435 House + 100 Senate + 3 DC)', '270 votes needed to win', 'Most states use winner-take-all allocation'],
    duration: '1 day (mid-Dec)',
    country: 'us',
  },
  {
    id: 'us-inauguration',
    title: 'Inauguration Day',
    icon: '🎖️',
    shortDescription: 'President sworn into office',
    fullDescription: 'On January 20th, the President-elect is sworn in as the new President of the United States at the US Capitol. The Chief Justice administers the oath of office.',
    keyFacts: ['Held on January 20th', 'Chief Justice of the Supreme Court administers oath', '"I do solemnly swear..." oath of office taken'],
    duration: '1 day',
    country: 'us',
  },
];

/** Voter guide wizard steps */
export const VOTER_GUIDE_STEPS: VoterGuideStep[] = [
  {
    id: 1,
    title: 'Check Your Eligibility',
    icon: '✅',
    description: 'Before anything else, confirm you meet the basic requirements to vote.',
    standardTips: [
      'India: You must be an Indian citizen aged 18 or above.',
      'Your name must be on the electoral roll in your constituency.',
      'You must not be disqualified under the Representation of People Act.',
      'US: You must be a US citizen, 18 or older, and meet your state residency requirements.',
    ],
    firstTimerTips: [
      '💡 Not sure if you\'re eligible? Visit the National Voters\' Service Portal (nvsp.in) and search your name.',
      '💡 Even if you\'ve just turned 18, you can register! The qualifying date is usually January 1st of the year.',
    ],
    links: [
      { label: 'Check name on voter list (India)', url: 'https://electoralsearch.eci.gov.in', country: 'india' },
      { label: 'Check eligibility (US)', url: 'https://vote.gov', country: 'us' },
    ],
  },
  {
    id: 2,
    title: 'Register to Vote',
    icon: '📋',
    description: 'Registration is the process of adding your name to the official voters\' list.',
    standardTips: [
      'India: Fill Form 6 on nvsp.in or submit it to your local Electoral Registration Officer (ERO).',
      'You\'ll need proof of age and proof of residence.',
      'US: Register at vote.gov or through your state DMV.',
      'Deadlines vary by state — many states close registration 15–30 days before an election.',
    ],
    firstTimerTips: [
      '💡 Form 6 is simpler than it looks — you only need 3 documents: age proof, address proof, and a photo.',
      '💡 After submitting, you\'ll get an acknowledgment. Your EPIC (Voter ID card) arrives within 30–60 days.',
      '💡 US tip: Some states allow same-day registration at the polling booth!',
    ],
    links: [
      { label: 'Register on NVSP (India)', url: 'https://www.nvsp.in', country: 'india' },
      { label: 'Register to vote (US)', url: 'https://vote.gov/register', country: 'us' },
    ],
  },
  {
    id: 3,
    title: 'What to Bring on Voting Day',
    icon: '🎒',
    description: 'Being prepared ensures a smooth, stress-free voting experience.',
    standardTips: [
      'India: Bring your EPIC (Voter ID card) or any of the 12 approved alternate documents.',
      'Approved IDs include: Aadhaar, Passport, Driving Licence, PAN Card, MNREGA Job Card, and more.',
      'US: ID requirements vary by state — check your state\'s specific requirements at vote.gov.',
      'Know your polling booth address in advance.',
    ],
    firstTimerTips: [
      '💡 Don\'t have your EPIC card yet? Your Aadhaar card is an accepted alternate ID in India.',
      '💡 Find your polling booth using your voter slip or the Voter Helpline App.',
      '💡 You can check your booth address at electoralsearch.eci.gov.in.',
    ],
    links: [
      { label: 'Find your polling booth (India)', url: 'https://electoralsearch.eci.gov.in', country: 'india' },
      { label: 'Find your polling place (US)', url: 'https://vote.gov/find-your-polling-place', country: 'us' },
    ],
  },
  {
    id: 4,
    title: 'At the Polling Station',
    icon: '🏛️',
    description: 'What happens when you arrive to cast your vote.',
    standardTips: [
      'Show your ID to the Presiding Officer and find your name in the voter register.',
      'Your left index finger will be marked with indelible (permanent) ink.',
      'You\'ll be given a ballot number slip — proceed to the EVM.',
      'Press the blue button next to your chosen candidate\'s name and symbol on the EVM.',
      'A VVPAT slip will appear for 7 seconds confirming your vote.',
    ],
    firstTimerTips: [
      '💡 Don\'t worry if you feel nervous — polling officers are there to guide you.',
      '💡 The ink on your finger is normal and will fade in 2–3 weeks.',
      '💡 The EVM is very simple: find your candidate\'s name, press the button. That\'s it!',
      '💡 US: You may use a paper ballot, touch screen, or other system depending on your county.',
    ],
  },
  {
    id: 5,
    title: 'How Votes Are Counted',
    icon: '📊',
    description: 'After polling closes, here is how your vote is counted.',
    standardTips: [
      'India: EVMs are sealed and transported to secure counting centres under guard.',
      'Counting begins on the designated counting day (usually a few weeks after polling).',
      'Each candidate\'s representatives (counting agents) are present to observe.',
      'Results are compared against Form 17C records for verification.',
      'US: Paper ballots are counted by optical scanners; results reported to state election offices.',
    ],
    firstTimerTips: [
      '💡 Your EVM stores votes securely even without power — no internet connection means no hacking!',
      '💡 Counting in a multi-phase election happens after ALL phases are complete.',
      '💡 The VVPAT audit provides an additional paper-based verification layer.',
    ],
  },
  {
    id: 6,
    title: 'After the Results',
    icon: '🎉',
    description: 'What happens once the election results are announced.',
    standardTips: [
      'The winning candidate in each constituency is declared by the Returning Officer.',
      'The party (or alliance) with majority seats forms the government.',
      'India: The President invites the majority leader to become Prime Minister.',
      'US: The Electoral College votes in December; inauguration is on January 20th.',
      'You can track results live on eci.gov.in or major news networks.',
    ],
    firstTimerTips: [
      '💡 Even if your preferred candidate didn\'t win, your vote was counted and contributed to the democratic record!',
      '💡 Election results are updated live — follow ECI\'s official channels for authentic results.',
      '💡 A new government is formed and starts working within days of the sworn-in ceremony.',
    ],
    links: [
      { label: 'Live results (India)', url: 'https://results.eci.gov.in', country: 'india' },
    ],
  },
];

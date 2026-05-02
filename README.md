# 🗳️ ElectionBot — AI-Powered Election Education Assistant

> An intelligent, multilingual civic education platform for first-time and informed voters in **India** (primary) and the **USA** (secondary).

[![Live App](https://img.shields.io/badge/Live%20App-election--assistant--494412.web.app-blue?style=flat-square&logo=firebase)](https://election-assistant-494412.web.app)
[![Backend](https://img.shields.io/badge/Backend-Cloud%20Run-green?style=flat-square&logo=google-cloud)](https://your-backend-url.us-central1.run.app)
[![GitHub](https://img.shields.io/badge/GitHub-ElectionBot-black?style=flat-square&logo=github)](https://github.com/CodeCatalyst-07/ElectionBot)
[![Model](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-orange?style=flat-square&logo=google)](https://ai.google.dev)

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend (Firebase Hosting)** | https://election-assistant-494412.web.app |
| **Backend API (Cloud Run)** | https://your-backend-url.us-central1.run.app |
| **GitHub Repository** | https://github.com/CodeCatalyst-07/ElectionBot |

---

## ✨ Features

- **🤖 AI Chatbot** — Powered by Google Gemini 2.5 Flash. Answers election questions with full conversation context. First-Time Voter mode simplifies explanations.
- **📅 Election Timeline** — Interactive, expandable stages for Indian (7-phase Lok Sabha) and US (primary → inauguration) elections.
- **📋 Voter Guide** — 6-step wizard covering eligibility, registration, documents, polling, counting, and results — with first-time voter tips.
- **🧠 Quiz** — 10-question shuffled knowledge quiz covering India + US. Score-based badge awards.
- **🔊 Text-to-Speech** — Google Cloud TTS with WaveNet voices for 7 Indian languages. Browser Web Speech API fallback when backend TTS is unavailable.
- **🌍 Multilingual** — 7-language selector: English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati.
- **♿ Accessibility Panel** — 5 toggles: larger text, high contrast, dyslexic-friendly font (OpenDyslexic), reduced motion, screen reader mode.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Backend | Node.js + Express + TypeScript |
| AI | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| Database | Firebase Firestore (Admin SDK) + in-memory fallback |
| TTS | Google Cloud Text-to-Speech + Web Speech API fallback |
| Translate | Google Cloud Translate (optional) |
| Auth/Calendar | Google OAuth2 Calendar (optional) |
| Hosting | Firebase Hosting (frontend) + Google Cloud Run (backend) |
| Testing | Jest (44 tests) + Cypress E2E + GitHub Actions CI |

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/CodeCatalyst-07/ElectionBot.git
cd ElectionBot
```

### 2. Install all dependencies
```bash
npm install          # root (installs concurrently)
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure environment variables
```bash
cp .env.example server/.env
```

Open `server/.env` and set at minimum:
```env
# REQUIRED — get from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Model — use gemini-2.5-flash (confirmed working on free tier)
GEMINI_MODEL=gemini-2.5-flash

# Server
PORT=8080
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

All other variables (Firebase, Translate, TTS, Calendar) are **optional** — the app runs fully without them using graceful fallbacks.

### 4. Start the development servers
```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080

### 5. Verify the backend is healthy
```bash
curl http://localhost:8080/api/health
```
Expected response:
```json
{
  "status": "healthy",
  "services": {
    "gemini": true,
    "translate": true,
    "tts": true,
    "calendar": true,
    "firebase": false
  }
}
```
> `"firebase": false` is normal when Firebase credentials are not set — the app uses in-memory session storage.

---

## 🔑 Environment Variables Reference

### `server/.env`

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google AI Studio API key |
| `GEMINI_MODEL` | Recommended | AI model name. Use `gemini-2.5-flash` |
| `PORT` | No | Server port (default: 8080) |
| `NODE_ENV` | No | `development` or `production` |
| `CLIENT_ORIGIN` | No | CORS origin for frontend |
| `GOOGLE_TRANSLATE_API_KEY` | Optional | Enables server-side translation proxy |
| `GOOGLE_TTS_API_KEY` | Optional | Enables Google Cloud TTS. Falls back to browser Web Speech API |
| `GOOGLE_CALENDAR_CLIENT_ID` | Optional | OAuth2 Calendar integration |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | Optional | OAuth2 Calendar integration |
| `FIREBASE_PROJECT_ID` | Optional | Firestore session persistence. Falls back to in-memory store |
| `FIREBASE_PRIVATE_KEY` | Optional | Firebase Admin SDK private key |
| `FIREBASE_CLIENT_EMAIL` | Optional | Firebase Admin SDK client email |

> ⚠️ **Never commit `server/.env` to Git.** It is listed in `.gitignore`. Use `.env.example` as the template.

---

## 🧪 Running Tests

### Server tests (12 tests)
```bash
cd server
npm test
```

### Client tests (22 tests)
```bash
cd client
npm test
```

### All tests — expected output
```
Test Suites: 9 passed (client)
Tests:       44 passed, 0 failed
Coverage:    95.52% statements (client), 97.7% statements (server)
```

---

## 🏭 Production Deployment

### Frontend — Firebase Hosting
```bash
cd client
npm run build
cd ..
firebase deploy --only hosting
```

**Deployed to:** https://election-assistant-494412.web.app

### Backend — Google Cloud Run
The backend is deployed as a Cloud Run service. To redeploy:
```bash
cd server
gcloud run deploy election-assistant-server \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=<key>,GEMINI_MODEL=gemini-2.5-flash
```

**Backend API:** https://your-backend-url.us-central1.run.app

### CI/CD Pipeline
Every push to `main` automatically triggers the GitHub Actions CI workflow (`.github/workflows/ci.yml`), which:
- Installs dependencies for root, server, and client
- Runs all 44 Jest tests across both server and client

Status is visible in the **GitHub Actions** tab of the repository.

---

## 📁 Project Structure

```
ElectionBot/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot/             # AI chat UI (bubble, input, TTS controls)
│   │   │   ├── Timeline/            # Election phase visualizer
│   │   │   ├── Quiz/                # 10-question quiz with badges
│   │   │   ├── VoterGuide/          # 6-step voter wizard
│   │   │   ├── Accessibility/       # A11y settings panel
│   │   │   ├── Navbar/              # Glass navbar + language selector
│   │   │   ├── Hero/                # Landing hero section
│   │   │   └── Features/            # Feature highlights grid
│   │   ├── hooks/
│   │   │   ├── useChat.ts           # Chat session state + API calls
│   │   │   ├── useTextToSpeech.ts   # TTS playback (null-safe, try/catch)
│   │   │   ├── useAccessibility.ts  # A11y settings (localStorage)
│   │   │   └── useTranslation.ts    # Language selection (localStorage)
│   │   ├── services/
│   │   │   ├── api.service.ts       # Axios client → Cloud Run backend
│   │   │   ├── chat.service.ts      # Chat API calls
│   │   │   ├── tts.service.ts       # TTS API + Web Speech fallback
│   │   │   ├── translate.service.ts # Translation API calls
│   │   │   └── calendar.service.ts  # Calendar event scheduling
│   │   ├── pages/                   # Chat, Home, QuizPage, VoterGuidePage
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── constants/               # Centralized client-side constants for API URLs, storage keys, and default values
│   │   └── utils/                   # dateUtils, quizUtils, sanitize
│   └── src/__tests__/               # Jest unit tests
│
├── server/                          # Express + TypeScript backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── gemini.service.ts    # Gemini AI chat (multi-turn history)
│   │   │   ├── firestore.service.ts # Session persistence + in-memory fallback
│   │   │   ├── tts.service.ts       # Google Cloud TTS
│   │   │   ├── translate.service.ts # Google Cloud Translate
│   │   │   └── calendar.service.ts  # Calendar OAuth2 + event creation
│   │   ├── routes/                  # /chat, /tts, /translate, /calendar, /health
│   │   ├── middleware/              # helmet, cors, rateLimit, validation, errorHandler
│   │   ├── types/                   # Server-side TypeScript interfaces
│   │   └── utils/                   # winston logger, constants
│   │   │   └── constants.ts         # Centralized server-side constants for ports, limits, error codes, and collection names
│   └── src/__tests__/               # Jest unit tests (Gemini, Translate, TTS)
│
├── functions/                       # Firebase Cloud Functions
│   └── src/index.ts                 # Session cleanup + activity logging
│
├── cypress/                         # E2E tests
│   └── e2e/chat.cy.ts               # Chat flow + navigation tests
│
├── firebase.json                    # Firebase Hosting + Functions config
├── firestore.rules                  # Firestore security rules (deny all client access)
├── firestore.indexes.json           # Firestore composite indexes
└── .env.example                     # Environment variable template
```

---

## 🔒 Security

| Concern | Implementation |
|---------|---------------|
| API key exposure | All Google API calls go through backend — never in browser |
| XSS | Input sanitized with Joi + HTML tag stripping server-side |
| Rate limiting | 20 req/min for chat, 100 req/min general (express-rate-limit) |
| Firestore | Client SDK access fully denied (`allow read, write: if false`) |
| CORS | Strict origin whitelist via `CLIENT_ORIGIN` env variable |
| Headers | Helmet.js: CSP, HSTS, XSS protection, no-sniff |

---

## 🐛 Known Fixes Applied

| Issue | Fix |
|-------|-----|
| `Cannot read properties of undefined (reading 'split')` on TTS | Added `null`/`undefined` guards in `resolveLanguageCode()`, wrapped all `SpeechSynthesis` calls in `try/catch` |
| `Failed to parse private key: Invalid PEM formatted message` | `firestore.service.ts` now wraps `initializeApp` in `try/catch` and detects placeholder credentials — falls back to in-memory store silently |
| `models/gemini-1.5-flash is not found for API version v1beta` | Model updated to `gemini-2.5-flash`; configurable via `GEMINI_MODEL` env variable without code changes |
| `.js` import extensions crashing `ts-node-dev` | Stripped all `.js` extensions from relative imports — resolved CJS/ESM conflict |
| Jest can't resolve `.js` imports in tests | Added `moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }` to `jest.config.js` |
| Hardcoded strings scattered across files | Extracted all hardcoded values into centralized constants files: `client/src/constants/index.ts` (5 new constants) and `server/src/utils/constants.ts` (11 new constants) |
| Missing JSDoc documentation on key functions | Added JSDoc comments to 6 files including `translate.service.ts`, `useAccessibility.ts`, `validation.middleware.ts`, `tts.service.ts`, and `server/src/index.ts` — 73 lines of documentation added total |
| Empty string being forwarded to `/translate` endpoint | Added empty and whitespace string guard in `translateText` that returns original text immediately without making a wasted API call |
| Jest validation warning: unknown option `setupFilesAfterFramework` | Renamed to `setupFilesAfterEnv` (correct Jest 29 option name) and added `esModuleInterop: true` to ts-jest globals configuration |
| No CI pipeline for automated testing | Added GitHub Actions workflow at `.github/workflows/ci.yml` that automatically runs all 44 tests on every push to `main` across Node.js 18 on `ubuntu-latest` |

---

## 📄 License

MIT — built for the Election PromptWars hackathon.

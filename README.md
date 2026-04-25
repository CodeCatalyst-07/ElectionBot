# Election Process Education Assistant

## Project Overview
An AI-powered web application that educates citizens about election processes in India and the United States. Built with React, Node.js, Google Gemini AI, and Firebase — designed for accessibility, multilingual support, and production-grade security.

## Features
- 🤖 **AI Chatbot** — Gemini-powered Q&A covering voter registration, eligibility, ID requirements, EVM process, vote counting, oath taking
- 📅 **Election Timeline** — Interactive visual timeline for Indian and US election stages
- 🗳️ **Voter Guide Wizard** — Step-by-step 6-stage voting walkthrough with First-Time Voter mode
- 🧠 **Interactive Quiz** — 10 election knowledge questions with badges and gamification
- 📆 **Google Calendar Integration** — Add election deadlines to your calendar with reminders
- 🌐 **Multilingual** — Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati via Google Translate API
- 🔊 **Text-to-Speech** — Every AI response readable aloud (Google TTS + Web Speech API fallback)
- ♿ **Accessibility Panel** — Font size, high contrast, dyslexia font, reduced motion, screen reader

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| AI | Google Gemini 1.5 Flash |
| Database | Firebase Firestore |
| Translation | Google Cloud Translation API v2 |
| Text-to-Speech | Google Cloud TTS API + Web Speech API |
| Calendar | Google Calendar API (OAuth2) |
| Hosting | Firebase Hosting + Cloud Functions |

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- A Google Cloud Project with billing enabled
- Firebase project

### Step 1 — Clone & Install
```bash
git clone https://github.com/your-org/election-assistant
cd election-assistant
npm install
cd server && npm install
cd ../client && npm install
```

### Step 2 — Configure Environment Variables
```bash
cp .env.example server/.env
```
Fill in the values as described in the section below.

### Step 3 — Run Locally
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8080

### Step 4 — Run Tests
```bash
npm test
```

---

## How to Get Each Google API Key

### Gemini API Key (REQUIRED)
1. Go to https://aistudio.google.com/app/apikey
2. Click **Create API Key**
3. Copy the key → paste as `GEMINI_API_KEY`

### Google Translate API Key (OPTIONAL)
1. Go to https://console.cloud.google.com/apis/library/translate.googleapis.com
2. Enable the **Cloud Translation API**
3. Go to **Credentials** → **Create Credentials** → **API Key**
4. Restrict the key to Translation API → paste as `GOOGLE_TRANSLATE_API_KEY`

### Google TTS API Key (OPTIONAL — app falls back to Web Speech API)
1. Go to https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
2. Enable the **Cloud Text-to-Speech API**
3. Create an API Key restricted to TTS API → paste as `GOOGLE_TTS_API_KEY`

### Google Calendar OAuth2 (OPTIONAL — shows fallback UI if absent)
1. Go to https://console.cloud.google.com/apis/credentials
2. Create **OAuth 2.0 Client ID** → Web application
3. Add `http://localhost:8080/api/calendar/callback` as authorized redirect URI
4. Copy **Client ID** and **Client Secret**

### Firebase Setup (REQUIRED for chat history persistence)
1. Go to https://console.firebase.google.com
2. Create a new project
3. Go to **Project Settings** → **Service Accounts** → **Generate new private key**
4. From the downloaded JSON, copy:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

---

## Deploy to Google Cloud

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
cd client && npm run build
firebase deploy --only hosting
```

### Cloud Functions
```bash
cd functions && npm install
firebase deploy --only functions
```

### Full Deploy
```bash
firebase deploy
```

---

## Folder Structure
```
election-assistant/
├── client/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # UI components (ChatBot, Timeline, Quiz, VoterGuide, Accessibility)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route-level page components
│   │   ├── services/          # API call wrappers
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Pure utility functions
│   │   └── constants/         # App-wide string constants
├── server/                    # Node.js Express backend
│   ├── src/
│   │   ├── middleware/        # Helmet, CORS, rate limiting, validation
│   │   ├── routes/            # Express route handlers
│   │   ├── services/          # Gemini, Translate, TTS, Calendar, Firestore
│   │   ├── types/             # Shared TypeScript types
│   │   └── utils/             # Logger, constants
├── functions/                 # Firebase Cloud Functions
├── cypress/                   # E2E tests
├── firebase.json              # Firebase hosting + functions config
└── .env.example               # Environment variable template
```

## Screenshots
*(Add screenshots here after deployment)*

---

## License
MIT

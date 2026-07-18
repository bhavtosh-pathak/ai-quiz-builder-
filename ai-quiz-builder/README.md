# AI Quiz Builder

A full-stack MERN application where educators generate quizzes with Google Gemini and students
compete in real time on a Socket.io-powered leaderboard.

```
Educator prompt  →  Gemini generates MCQs  →  Review & publish  →  Students join by code
                                                                          ↓
                                              Live leaderboard  ←  Auto-graded submission
```

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Features](#features)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Seeding demo data](#seeding-demo-data)
- [API overview](#api-overview)
- [Socket.io events](#socketio-events)
- [Deployment](#deployment)
- [Known limitations / next steps](#known-limitations--next-steps)

## Tech stack

**Backend:** Node.js, Express.js, MongoDB + Mongoose, Socket.io, JWT, bcrypt, Google Gemini API
(`@google/generative-ai`), express-validator, express-rate-limit.

**Frontend:** React 18 (Vite), React Router, Tailwind CSS, Axios, Context API, Socket.io client,
Chart.js, jsPDF (PDF export + certificates), react-hot-toast.

## Project structure

```
ai-quiz-builder/
├── backend/
│   ├── config/db.js               # Mongoose connection
│   ├── controllers/                # Route handler logic
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── aiController.js         # Gemini integration endpoints
│   │   ├── attemptController.js    # Scoring + leaderboard broadcast
│   │   └── dashboardController.js  # Analytics aggregation
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verify + role-based access
│   │   ├── errorMiddleware.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js                 # embeds Question sub-schema
│   │   └── Attempt.js
│   ├── routes/                     # One file per resource
│   ├── services/geminiService.js   # All Gemini prompt-building + parsing
│   ├── sockets/socketHandler.js    # Rooms, presence, leaderboard broadcast
│   ├── utils/                      # generateToken, shuffle, seed script
│   └── server.js                   # App entry point
│
└── frontend/
    └── src/
        ├── components/             # Reusable UI: Navbar, LeaderboardTable, Timer, etc.
        ├── pages/
        │   ├── teacher/             # Dashboard, MyQuizzes, CreateQuiz, AIQuizGenerator, QuizResults
        │   ├── student/             # Dashboard, BrowseQuizzes, JoinQuiz, QuizAttempt, QuizResult, MyResults
        │   └── (Landing, Login, Register, Profile, LeaderboardPage, NotFound)
        ├── layouts/                 # DashboardLayout, AuthLayout
        ├── context/                 # AuthContext, SocketContext, ThemeContext
        ├── hooks/useLiveQuizRoom.js  # Socket + REST leaderboard hook
        └── services/                 # Axios wrappers per resource
```

## Features

**Educators** register/login, generate quizzes from a prompt ("Generate 10 Java OOP MCQs"),
edit or delete any AI-generated question, build quizzes manually, publish/close quizzes, view a
live leaderboard and per-question breakdown, export results to PDF, and see an analytics
dashboard (totals, average score, top performers, per-quiz chart).

**Students** register/login, join a quiz via a 6-character code (or browse open quizzes),
attempt timed MCQ quizzes with auto-submit on timeout, see their score and rank immediately,
review answers with on-demand AI explanations for anything they got wrong, download a
certificate for passing scores, and track performance history on their dashboard.

**Real-time:** every quiz has a Socket.io room. Joining shows a live participant count;
every submission recalculates and broadcasts the leaderboard to everyone in the room instantly
— no polling, no refresh.

**Bonus features implemented:** dark mode toggle (foundation wired via Tailwind `dark:` class
strategy — extend per-component as needed), PDF export of leaderboards, AI-generated answer
explanations, PDF certificates for passing students, shareable quiz codes, search + filter +
pagination on quiz lists, and profile management (name, institution, password).

## Local setup

### Prerequisites
- Node.js 18+
- A running MongoDB instance (local or Atlas)
- A Google Gemini API key ([ai.google.dev](https://ai.google.dev))

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev        # nodemon, http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # optional in local dev, Vite proxies /api to :5000 automatically
npm run dev             # http://localhost:5173
```

Open `http://localhost:5173`, register as an Educator in one browser (or incognito window) and
as a Student in another to try the full flow — create/generate a quiz, publish it, join with the
code, and watch the leaderboard update live across both windows.

## Environment variables

### backend/.env

| Variable | Description |
|---|---|
| `PORT` | API port (default `5000`) |
| `NODE_ENV` | `development` \| `production` |
| `CLIENT_URL` | Frontend origin, used for CORS and Socket.io CORS |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | e.g. `gemini-2.5-flash` |
| `AI_RATE_LIMIT_MAX` / `AI_RATE_LIMIT_WINDOW_MIN` | Throttles `/api/ai/*` to protect your Gemini quota |

### frontend/.env

| Variable | Description |
|---|---|
| `VITE_SOCKET_URL` | Backend origin for the Socket.io client (e.g. `https://api.yourapp.com`) |

## Seeding demo data

```bash
cd backend
npm run seed
```

Creates a demo teacher, demo student, and one published sample quiz so you can log in and
explore immediately. Credentials and the sample quiz code are printed to the console.

## API overview

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register (teacher or student) |
| POST | `/auth/login` | Public | Login |
| GET/PUT | `/auth/me` | Private | Get / update own profile |
| POST | `/quizzes` | Teacher | Create a quiz |
| GET | `/quizzes/mine` | Teacher | List own quizzes (search/filter/paginate) |
| GET | `/quizzes/available` | Student | List published quizzes not yet attempted |
| GET | `/quizzes/join/:code` | Student | Fetch a quiz (answers stripped) to attempt |
| GET/PUT/DELETE | `/quizzes/:id` | Owner | Read / update / delete a quiz |
| DELETE | `/quizzes/:id/questions/:qid` | Owner | Delete one question |
| PATCH | `/quizzes/:id/publish` \| `/close` | Owner | Change quiz status |
| POST | `/ai/generate-quiz` | Teacher | Generate MCQs from a prompt via Gemini |
| POST | `/ai/explain` | Private | AI explanation for a specific answer |
| POST | `/attempts/:quizId/submit` | Student | Submit + server-side score an attempt |
| GET | `/attempts/:quizId/leaderboard` | Private | Current leaderboard |
| GET | `/attempts/:quizId/all` | Owner | All attempts for a quiz (teacher view) |
| GET | `/attempts/mine` \| `/attempts/:id` | Private | A student's own attempts |
| GET | `/dashboard/teacher` \| `/dashboard/student` | Role | Analytics summary |

## Socket.io events

| Event | Direction | Payload |
|---|---|---|
| `room:join` / `room:leave` | client → server | `{ quizId }` |
| `room:participantCount` | server → room | `{ quizId, count }` |
| `leaderboard:update` | server → room | sorted leaderboard array |
| `attempt:new` | server → room | `{ studentName, score, percentage }` |
| `quiz:progress` | client → room | `{ quizId, answeredCount, totalQuestions }` |
| `quiz:studentProgress` | server → room | live progress broadcast |

Sockets authenticate with the same JWT as the REST API, passed via `socket.handshake.auth.token`.

## Deployment

**Backend (Render / Railway / Fly.io / any Node host):**
1. Set all backend env vars in the host's dashboard (never commit `.env`).
2. Build command: `npm install`. Start command: `npm start`.
3. Point `CLIENT_URL` at your deployed frontend origin so CORS and Socket.io CORS both work.
4. Use MongoDB Atlas for a managed database; whitelist your host's outbound IP (or `0.0.0.0/0` for quick testing).

**Frontend (Vercel / Netlify):**
1. Build command: `npm run build`. Output directory: `dist`.
2. Set `VITE_SOCKET_URL` to your backend's public URL.
3. If deploying frontend and backend separately, update the backend's `CLIENT_URL` to match your
   frontend's production domain, and change the Vite `server.proxy` target for local dev only —
   production builds call `/api` directly, so put the frontend behind a proxy/rewrite to the
   backend, or set `VITE_API_URL` and update `src/services/api.js`'s `baseURL` accordingly if you
   host the two on different domains.

**Process manager (self-hosted):** run the backend with `pm2 start server.js --name aqb-api` for
restarts and log management.

## Known limitations / next steps

- Dark mode's context/toggle is fully wired, but only core surfaces have `dark:` classes — extend
  Tailwind `dark:` variants across remaining components for full dark-theme coverage.
- The Socket.io room-participant map is in-memory, which is fine for a single server instance;
  add the `@socket.io/redis-adapter` before scaling to multiple backend instances.
- No automated test suite is included — recommend adding Jest + Supertest for the API and
  Vitest + React Testing Library for the frontend as a next step.
- Gemini's JSON output is validated and malformed questions are filtered out, but very unusual
  prompts may still return zero questions — the UI surfaces this as a clear error to retry.

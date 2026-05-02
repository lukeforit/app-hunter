
# 🎯 The Hunter | Job Applications Tracker

**The Hunter** is a lightweight job application tracker built for people who value data privacy. All job data lives in your browser's `localStorage` — no cloud database, no account required. A small Node.js proxy handles Gemini AI requests so your API key is never exposed to the browser.

## 🚀 Key Features

- **AI-powered extraction:** Paste a job URL or description — Gemini automatically extracts company, role, location, salary, and work mode.
- **Dashboard:** Save, update, and track your applications through every stage.
- **Data Portability:** Export your history as a `JSON` file or import one to switch devices.
- **Local-first:** All data stays on your machine via `localStorage`.
- **Compact Mode:** Toggle between comfortable and compact views to manage 20+ applications on one screen.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| i18n | i18next |
| AI proxy | Node.js + Express |
| AI model | Google Gemini (`@google/genai`) |
| Persistence | Browser `localStorage` |

## ⚙️ Local Development Setup

### 1. Prerequisites

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **A Google Gemini API key** — obtain one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file and fill in your key:

```bash
cp .env.example .env
```

Open `.env` and set your key:

```dotenv
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGIN=http://localhost:3000
PORT=3001
NODE_ENV=development
```

> ⚠️ `.env` is listed in `.gitignore` and must **never** be committed. The `GEMINI_API_KEY` is only read by the Express server — it is never sent to the browser.

### 4. Start the Development Servers

A single command starts both the Vite dev server (port 3000) and the Express proxy (port 3001):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The Vite config proxies all `/api/*` requests from the frontend to the Express server automatically — no manual CORS configuration needed in development.

#### Running Servers Separately (optional)

```bash
# Terminal 1 — Vite frontend
npm run dev:client

# Terminal 2 — Express proxy
npm run dev:server
```

## 🏗️ Architecture

```
Browser (port 3000)          Express Proxy (port 3001)        Google Gemini API
─────────────────────        ─────────────────────────        ─────────────────
React App
  └── fetch('/api/extract')
       ↓ Vite proxy (dev)
       └──────────────────→  POST /api/extract
                               reads GEMINI_API_KEY
                               validates & rate-limits
                               └────────────────────────────→  generateContent()
                               ←────────────────────────────  JSON response
       ←──────────────────  { companyName, role, ... }
```

The API key lives **only** in the server process environment. The compiled frontend bundle contains no secrets.

## 📦 Production Build

```bash
npm run build        # Vite outputs static files to /dist
npm run start        # Starts the Express server in production mode
```

In production the Express server also serves the `/dist` folder as static files. If you prefer to use a dedicated web server (nginx, Apache, Caddy), configure it to:
- Serve `/dist` as the static document root.
- Proxy `/api/*` to `http://localhost:3001`.
- Return `index.html` for any unmatched routes (SPA fallback).

Set `NODE_ENV=production` and your live `ALLOWED_ORIGIN` in the production environment before starting.

## 📂 Data Schema

Each job entry follows this structure:

```json
{
  "id": "uuid",
  "companyName": "string",
  "role": "string",
  "location": "string",
  "salary": "string (e.g. $150,000)",
  "workMode": "On-site | Remote | Hybrid",
  "dateApplied": "YYYY-MM-DD",
  "link": "string (URL)",
  "status": "Sent | Interviewing | Rejected"
}
```

## ⚠️ Limitations & Data Persistence

Since all job data is stored in `localStorage`:

- **Browser-bound:** Data is tied to the specific browser and device. It won't sync automatically across devices.
- **Cache risk:** Clearing browser data **will delete your jobs**. Use **Export to JSON** regularly as a backup.
- **Privacy:** Job data never leaves your device. Only the text you submit for AI parsing is sent to Google Gemini (via the proxy).

## 📜 License

MIT. Built with 🎯 for the hunt.

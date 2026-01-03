
# 🎯 The Hunter | Job Applications Tracker

**The Hunter** is a lightweight job application tracker designed for people who value data privacy. It features a "no-backend" architecture, keeping all your data in your browser's local storage with seamless AI-powered parsing.

## 🚀 Key Features

- **Job details extraction (with Gemini AI):** Paste a job URL or full job description, and the built-in Gemini AI will automatically extract the company, role, location, salary, and work mode.
- **Dashboard:** Save, update and track your job applications. 
- **Data Portability:** Export your entire hunt history as a `JSON` file or import an existing one to switch devices.
- **No Backend Required:** Zero database setup. All data stays on your machine via `localStorage`.
- **Compact Mode:** Toggle between comfortable and compact views to manage 20+ applications on a single screen.

## 🛠️ Tech Stack

- **Framework:** React 19 (ESM based)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Google Gemini API (`@google/genai`)
- **Persistence:** Browser `localStorage`

## ⚙️ Setup & Requirements

1. **API Key:** 
   - Get a Google Gemini API key.
   - Create a `.env` file in the root directory.
   - Add your key: `API_KEY="your_api_key_here"`
2. **Local Development:** 
   ```bash
   npm install
   npm run dev
   ```

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

Since **The Hunter** runs entirely in your browser without a backend database:

- **Browser Storage:** All data is stored in your browser's `localStorage`. Clearing your browser cache **will delete your data**.
- **Device Specific:** Your jobs are tied to the specific browser and device you are using. They will not automatically sync to your phone or laptop.
- **Privacy:** Your data never leaves your device (except when sending descriptions to Google Gemini for parsing).

**Recommendation:** regularly use the **Export to JSON** feature to backup your data.

## 📜 License

MIT. Built with 🎯 for the hunt.

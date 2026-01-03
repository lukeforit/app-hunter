
# 🎯 The Hunter | Job Applications Tracker

**The Hunter** is a lightweight job application tracker designed for people who value data privacy. It features a "no-backend" architecture, keeping all your data in your browser's local storage with seamless AI-powered parsing.

## 🚀 Key Features

- **Magic Paste (AI Parser):** Paste a job URL or full job description, and the built-in Gemini AI will automatically extract the company, role, location, salary, and work mode.
- **Visual Dashboard:** A clean, "Linear-style" interface to track your applications with color-coded status badges.
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

## 📜 License

MIT. Built with 🎯 for the hunt.

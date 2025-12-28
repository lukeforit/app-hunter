## AI Extraction Spec: "The Magic Parser"

### 🎯 Objective
Create a robust internal logic for "The Hunter" to convert messy, unstructured input (Job URLs or copied job descriptions) into a clean, structured JSON object that matches our application schema.

### 🧠 Logic Requirements
The AI should act as a specialized data extraction engine. When a user pastes content into the "Magic Paste" area, the system should:

1. **Identify Input Type:** Detect if the input is a URL or a block of text.
2. **Text Scrubbing:** Strip away "noise" (e.g., website headers, footers, similar jobs sidebars).
3. **Data Mapping:** Extract the following fields based on these rules:
    - **Company Name:** The hiring entity.
    - **Role:** The job title (e.g., "Senior Frontend Engineer").
    - **Location:** City/State/Country.
    - **Work Mode:** Categorize strictly as `On-site`, `Remote`, or `Hybrid`. If not specified, default to `On-site`.
    - **Link:** If text was pasted, leave empty or use the source URL if provided.
    - **Status:** Default to `Sent`.

### 🛠️ Technical Implementation 
When calling the LLM for extraction, use the following System Message:

> "You are a specialized JSON extraction tool. Your task is to take a job description or a URL and return ONLY a valid JSON object. 
> 
> Schema:
> {
>   "companyName": string,
>   "role": string,
>   "location": string,
>   "workMode": "On-site" | "Remote" | "Hybrid",
>   "link": string,
>   "dateApplied": "YYYY-MM-DD",
>   "status": "Sent"
> }
>
> If a value is missing, return an empty string. Do not include markdown formatting or prose. Return only the JSON."

### 🚦 Error Handling
- If the AI cannot determine the Company or Role, return the best guess but flag it in the UI for user verification.
- Provide a "Review & Edit" modal immediately after the AI parses the data so the user can fix any "vibe" errors before saving to LocalStorage.

### 💅 UI Vibe for Parser
- **Loading State:** Use a "shimmer" effect or a "Scanning..." animation to give the user immediate feedback that the AI is working.
- **Success State:** Briefly highlight the newly added row in the list with a subtle glow.

### 🚀 Key Features

1. The "Magic Paste" Input (AI Parser)
A prominent input area where I can paste a Job URL or the Full Text of a job description.
Logic: Use an LLM prompt (via a "vibecoding" instruction) to parse the text/URL and automatically fill out the `companyName`, `role`, `location`, and `workMode`.
Note: Since this is frontend only, provide a clear UI state for "Processing..." while the AI extracts the data.

2. The Dashboard (The List)
A clean table or card view of all applications.
Status badges with color coding:
- Sent = Blue
- Interviewing = Purple/Yellow
- Rejected = Red
Quick-edit buttons for changing status or deleting.

3. Data Portability (The "No-Backend" Special)
Export: A button that generates and downloads a my-jobs.json file.
Import: A button to upload a .json file that populates the app state.
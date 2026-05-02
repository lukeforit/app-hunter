import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI, Type } from '@google/genai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';
const __dirname = dirname(fileURLToPath(import.meta.url));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = ALLOWED_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' is not allowed`));
    }
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type'],
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────
// 20 requests per minute per IP — tune to your Gemini quota
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait a moment before retrying.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '50kb' }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Gemini Proxy ──────────────────────────────────────────────────────────────
app.post('/api/extract', async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Request body must contain a "text" string.' });
  }
  if (text.length > 10_000) {
    return res.status(400).json({ error: 'Input too long (max 10 000 characters).' });
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('[/api/extract] GEMINI_API_KEY is not set');
    return res.status(500).json({ error: 'Server is not configured. Please set GEMINI_API_KEY.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Extract job details from this text or URL. Return JSON.\n\nSource Content:\n${text}`,
      config: {
        systemInstruction: `You are a high-precision recruitment data extractor.
          Analyze the input and map it to: companyName, role, location, workMode (On-site, Remote, Hybrid), link, and salary.
          Salary Extraction Rules:
          1. If a range is provided (e.g., "$120k - $150k"), extract only the maximum numerical value (e.g., "$150,000").
          2. If no salary is found, return an empty string.
          3. Include currency symbols if present.
          Defaults: workMode = 'On-site'.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            role:        { type: Type.STRING },
            location:    { type: Type.STRING },
            workMode:    { type: Type.STRING, enum: ['On-site', 'Remote', 'Hybrid'] },
            link:        { type: Type.STRING },
            salary:      { type: Type.STRING },
          },
          required: ['companyName', 'role', 'location', 'workMode'],
        },
      },
    });

    return res.json(JSON.parse(response.text));
  } catch (err) {
    console.error('[/api/extract] Gemini error:', err?.message ?? err);

    if (err?.status === 429 || err?.message?.includes('quota')) {
      return res.status(429).json({ error: 'AI quota exceeded. Try again later.' });
    }
    return res.status(502).json({ error: 'AI service unavailable. Please try again later.' });
  }
});

// ── Static files (production only) ───────────────────────────────────────────
// In development, Vite's dev server handles static files.
// In production, if you're NOT using a dedicated web server (nginx/Apache),
// Express will serve the Vite build output from /dist.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '..', 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`   CORS allowed origins: ${allowedOrigins.join(', ')}`);
});


import { AIJobExtraction } from '../types';

/**
 * Retries a fetch on transient 503 errors with exponential backoff.
 * Other error statuses are returned immediately without retrying.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, options);
    // Only retry on 503 Service Unavailable (transient Gemini outage)
    if (res.status !== 503 || attempt === retries) return res;
    // Exponential backoff: 1 s, 2 s, …
    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
  }
  // This line is unreachable but satisfies TypeScript's control-flow analysis.
  throw new Error('Max retries exceeded');
}

export async function extractJobFromText(text: string): Promise<AIJobExtraction> {
  const res = await fetchWithRetry('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore parse errors, keep the HTTP status message
    }
    throw new Error(message);
  }

  return res.json() as Promise<AIJobExtraction>;
}

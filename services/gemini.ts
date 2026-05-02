
import { AIJobExtraction } from '../types';

export async function extractJobFromText(text: string): Promise<AIJobExtraction> {
  const res = await fetch('/api/extract', {
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

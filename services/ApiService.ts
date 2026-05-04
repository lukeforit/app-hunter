import { AIJobExtraction } from '../types';

/**
 * Retries a fetch on transient 503 errors and falls back to a secondary URL
 * if the primary URL fails with a 404, 502, 503, or network error.
 */
async function fetchWithRetryAndFallback(
  primaryUrl: string,
  fallbackUrl: string,
  options: RequestInit,
  retries = 2
): Promise<Response> {
  // 1. Attempt primary endpoint (Node.js API)
  try {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(primaryUrl, options);
      
      // If successful, return immediately
      if (res.ok) return res;
      
      // If it's a 503 (transient error), retry
      if (res.status === 503 && attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      
      // If the Node.js endpoint is missing (404) or bad gateway (502) or exhausted 503s, 
      // trigger the fallback by throwing an error
      if (res.status === 404 || res.status === 502 || res.status === 503) {
        throw new Error(`Primary endpoint failed with status ${res.status}`);
      }
      
      // For client errors (400, 429), return response so the caller can display the error
      return res;
    }
  } catch (error) {
    console.warn(`[ApiService] Primary endpoint (${primaryUrl}) unavailable. Falling back to ${fallbackUrl}.`, error);
    
    // 2. Fallback to PHP Proxy endpoint
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const fallbackRes = await fetch(fallbackUrl, options);
        // Only retry on 503 from fallback
        if (fallbackRes.status !== 503 || attempt === retries) return fallbackRes;
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      } catch (fallbackError) {
        // If fetch itself throws (e.g. network error) on the last attempt, propagate it
        if (attempt === retries) throw fallbackError;
      }
    }
  }
  
  throw new Error('All API endpoints failed.');
}

export async function extractJobFromText(text: string): Promise<AIJobExtraction> {
  const res = await fetchWithRetryAndFallback('/api/extract', '/proxy.php', {
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

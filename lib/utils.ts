
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  return inputs
    .flatMap((input) => {
      if (!input) return [];
      if (typeof input === 'string') return [input];
      return Object.entries(input)
        .filter(([_, value]) => value)
        .map(([key]) => key);
    })
    .join(' ');
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Prevent java\nscript: by stripping whitespace that could confuse parsers
  const withoutWhitespace = trimmed.replace(/[\n\r\t]/g, '');

  try {
    const parsed = new URL(withoutWhitespace);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return '';
  } catch (e) {
    // If parsing fails, and it doesn't have a protocol, assume https
    if (!/^[a-zA-Z][a-zA-Z0-9+\-.]*:/.test(withoutWhitespace)) {
        try {
            const httpsUrl = new URL(`https://${withoutWhitespace}`);
            return httpsUrl.toString();
        } catch (err) {
            return '';
        }
    }
    return '';
  }
}

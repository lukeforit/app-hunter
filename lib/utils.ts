
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

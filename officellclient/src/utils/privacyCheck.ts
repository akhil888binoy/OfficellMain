export type PrivacyKind = 'email' | 'phone' | 'exact_date' | 'possible_name' | 'small_team' | 'url';
export type PrivacyMatch = { start: number; end: number; text: string; kind: PrivacyKind; blocking: boolean };

const patterns: Array<{ kind: PrivacyKind; pattern: RegExp; blocking: boolean }> = [
  { kind: 'email', pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, blocking: true },
  { kind: 'phone', pattern: /(?<!\w)(?:\+?\d[\s().-]*){10,15}(?!\w)/g, blocking: true },
  { kind: 'exact_date', pattern: /\b(?:0?[1-9]|[12]\d|3[01])[/.-](?:0?[1-9]|1[0-2])[/.-](?:19|20)?\d{2}\b/gi, blocking: true },
  { kind: 'exact_date', pattern: /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?\b/gi, blocking: true },
  { kind: 'possible_name', pattern: /\b(?:founder|manager|ceo|cto|boss|supervisor|lead)\s+(?:named\s+)?[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?\b/g, blocking: false },
  { kind: 'small_team', pattern: /\b(?:team of\s+\d+|only\s+(?:intern|developer|designer|employee|woman|man|new hire)|sole\s+(?:intern|developer|designer|employee|woman|man|new hire))\b/gi, blocking: false },
  { kind: 'url', pattern: /https?:\/\/[^\s]+/gi, blocking: false },
];

export const findPrivacyMatches = (content: string): PrivacyMatch[] => {
  const matches = patterns.flatMap(({ kind, pattern, blocking }) =>
    [...content.matchAll(pattern)]
      .filter(match => kind !== 'phone' || (() => {
        const length = match[0].replace(/\D/g, '').length;
        return length >= 10 && length <= 15;
      })())
      .map(match => ({ start: match.index, end: match.index + match[0].length, text: match[0], kind, blocking })),
  );
  matches.sort((a, b) => Number(b.blocking) - Number(a.blocking) || a.start - b.start || b.end - a.end);
  const visible: PrivacyMatch[] = [];
  for (const match of matches) {
    if (!visible.some(existing => match.start < existing.end && match.end > existing.start)) visible.push(match);
  }
  return visible.sort((a, b) => a.start - b.start);
};

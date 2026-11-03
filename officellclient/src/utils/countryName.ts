const names = new Intl.DisplayNames(['en'], { type: 'region' });

export function countryName(code: string): string {
  if (!/^[a-z]{2}$/i.test(code)) return code;
  return names.of(code.toUpperCase()) ?? code;
}

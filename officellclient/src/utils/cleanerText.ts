export const cleanDomain = (url: string) => {
  if (!url) return '';
  try {
    return url
      .replace(/^https?:\/\//, '') 
      .replace(/^www\./, '') 
      .replace(/\/$/, ''); 
  } catch {
    return url; 
  }
};

export const cleanCountryName = (name: string) => {
  if (!name) return '';
  return name
    .replace(/^(?:the\s|The\s)/i, '') 
    .replace(/\s*\(the\)$/i, '') 
    .trim(); 
};
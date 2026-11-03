export const COMPANY_NEARBY_AREA_KEY = 'officell-company-nearby-area';

export type SavedNearbyArea = { kind: 'manual'; country: string; region: string; mncOnly: boolean };

export function readNearbyArea(): SavedNearbyArea | null {
  try {
    const raw = sessionStorage.getItem(COMPANY_NEARBY_AREA_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as SavedNearbyArea;
    if (value.kind === 'manual' && /^[A-Z]{2}$/.test(value.country) && (value.region?.length > 0 || value.mncOnly)) return value;
  } catch {
    // Ignore malformed or unavailable session storage.
  }
  return null;
}

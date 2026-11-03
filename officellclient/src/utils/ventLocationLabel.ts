import { countryName } from './countryName';
import type { Vent } from '../types/vent';

export function ventLocationLabel(vent: Vent): string | undefined {
  if (!vent.location) return undefined;
  return vent.location.city ?? countryName(vent.location.country);
}

import type { Vent } from '../types/vent';

export const appendUniqueVents = (current: Vent[], incoming: Vent[]): Vent[] => {
  const seen = new Set(current.map(vent => String(vent.id)));
  return [...current, ...incoming.filter(vent => {
    const id = String(vent.id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  })];
};

export const prependUniqueVent = (current: Vent[], incoming: Vent): Vent[] =>
  current.some(vent => String(vent.id) === String(incoming.id)) ? current : [incoming, ...current];

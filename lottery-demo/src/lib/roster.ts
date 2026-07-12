import type { Person } from './types';

export const STORAGE_KEY = 'peach_lottery_roster';
export const DEFAULT_NAMES = ['小桃', '阿源', '春花', '青山', '白鹿', '星河', '阿竹', '小雲', '青梅', '紅袖'];

export function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function parseNames(input: string) {
  return input
    .split(/[\n,，、]/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function makeUniqueName(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}${n}`)) n += 1;
  return `${base}${n}`;
}

export function peopleFromNames(parsed: string[]): Person[] {
  const taken = new Set<string>();
  return parsed
    .map((raw) => {
      const trimmed = raw.trim();
      if (!trimmed) return null;
      const finalName = makeUniqueName(trimmed, taken);
      taken.add(finalName);
      return { id: createId(), name: finalName };
    })
    .filter(Boolean) as Person[];
}

export function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickWinners(pool: Person[], count: number): Person[] {
  if (pool.length === 0 || count <= 0) return [];
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export function normalizePerson(raw: unknown): Person | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return null;
  return { id: o.id, name: o.name };
}

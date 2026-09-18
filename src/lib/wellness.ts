import { getAuthenticatedUsername } from './auth';

export type WellnessProfile = {
  heightCm: number | null;
  weightKg: number | null;
  updatedAt: string | null;
};

export type DietEntry = {
  id: string;
  date: string;
  mealType: string;
  description: string;
  notes: string;
  createdAt: string;
};

const WELLNESS_PROFILE_KEY_PREFIX = 'athletiq_wellness_profile:';
const DIET_ENTRIES_KEY_PREFIX = 'athletiq_diet_entries:';

function getProfileKey(username: string): string {
  return `${WELLNESS_PROFILE_KEY_PREFIX}${username}`;
}

function getDietKey(username: string): string {
  return `${DIET_ENTRIES_KEY_PREFIX}${username}`;
}

export function calculateBmi(heightCm: number | null, weightKg: number | null): number | null {
  if (heightCm === null || weightKg === null) return null;
  if (!Number.isFinite(heightCm) || !Number.isFinite(weightKg)) return null;
  if (heightCm <= 0 || weightKg <= 0) return null;

  const heightMeters = heightCm / 100;
  if (heightMeters <= 0) return null;

  return weightKg / (heightMeters * heightMeters);
}

export function getWellnessProfile(): WellnessProfile | null {
  const username = getAuthenticatedUsername();
  if (!username) return null;

  try {
    const raw = localStorage.getItem(getProfileKey(username));
    if (!raw) return null;
    const profile = JSON.parse(raw) as Partial<WellnessProfile>;
    if (
      (profile.heightCm !== null && typeof profile.heightCm !== 'number')
      || (profile.weightKg !== null && typeof profile.weightKg !== 'number')
      || (profile.updatedAt !== null && typeof profile.updatedAt !== 'string')
    ) {
      return null;
    }
    return {
      heightCm: profile.heightCm ?? null,
      weightKg: profile.weightKg ?? null,
      updatedAt: profile.updatedAt ?? null,
    };
  } catch {
    return null;
  }
}

export function saveWellnessProfile(profile: WellnessProfile): boolean {
  const username = getAuthenticatedUsername();
  if (!username) return false;

  const nextProfile = {
    heightCm: profile.heightCm,
    weightKg: profile.weightKg,
    updatedAt: profile.updatedAt ?? new Date().toISOString(),
  };
  localStorage.setItem(getProfileKey(username), JSON.stringify(nextProfile));
  return true;
}

export function getDietEntries(): DietEntry[] {
  const username = getAuthenticatedUsername();
  if (!username) return [];

  try {
    const raw = localStorage.getItem(getDietKey(username));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<DietEntry>[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((entry): entry is DietEntry => (
      typeof entry?.id === 'string'
      && typeof entry?.date === 'string'
      && typeof entry?.mealType === 'string'
      && typeof entry?.description === 'string'
      && typeof entry?.notes === 'string'
      && typeof entry?.createdAt === 'string'
    ));
  } catch {
    return [];
  }
}

export function saveDietEntries(entries: DietEntry[]): boolean {
  const username = getAuthenticatedUsername();
  if (!username) return false;
  localStorage.setItem(getDietKey(username), JSON.stringify(entries));
  return true;
}

export function addDietEntry(entry: Omit<DietEntry, 'id' | 'createdAt'>): DietEntry | null {
  const username = getAuthenticatedUsername();
  if (!username) return null;

  const newEntry: DietEntry = {
    ...entry,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
  };

  const entries = getDietEntries();
  saveDietEntries([newEntry, ...entries]);
  return newEntry;
}

export function removeDietEntry(id: string): boolean {
  const username = getAuthenticatedUsername();
  if (!username) return false;

  const entries = getDietEntries().filter(entry => entry.id !== id);
  saveDietEntries(entries);
  return true;
}

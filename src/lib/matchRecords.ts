import { getAuthenticatedUsername } from './auth';

export type MatchRecord = {
  id: string;
  event: string;
  date: string;
  sport: string;
  competition: string;
  result: string;
  notes: string;
  verified: 'official' | 'self';
  createdAt: string;
};

const MATCH_RECORDS_KEY_PREFIX = 'athletiq_match_records:';

function recordsStorageKey(username: string): string {
  return `${MATCH_RECORDS_KEY_PREFIX}${username}`;
}

export function getStudentMatchRecords(): MatchRecord[] {
  const username = getAuthenticatedUsername();
  if (!username) return [];

  try {
    const stored = localStorage.getItem(recordsStorageKey(username));
    if (!stored) return [];
    const records = JSON.parse(stored) as Partial<MatchRecord>[];
    if (!Array.isArray(records)) return [];
    return records.filter((record): record is MatchRecord => (
      typeof record?.id === 'string'
      && typeof record?.event === 'string'
      && typeof record?.date === 'string'
      && typeof record?.sport === 'string'
      && typeof record?.competition === 'string'
      && typeof record?.result === 'string'
      && typeof record?.notes === 'string'
      && (record?.verified === 'official' || record?.verified === 'self')
    ));
  } catch {
    return [];
  }
}

export function saveStudentMatchRecords(records: MatchRecord[]): boolean {
  const username = getAuthenticatedUsername();
  if (!username) return false;

  localStorage.setItem(recordsStorageKey(username), JSON.stringify(records));
  return true;
}

export function addStudentMatchRecord(record: Omit<MatchRecord, 'id' | 'createdAt'>): MatchRecord | null {
  const username = getAuthenticatedUsername();
  if (!username) return null;

  const records = getStudentMatchRecords();
  const newRecord: MatchRecord = {
    ...record,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
  };
  saveStudentMatchRecords([newRecord, ...records]);
  return newRecord;
}

export function updateStudentMatchRecord(
  id: string,
  updates: Partial<Omit<MatchRecord, 'id' | 'createdAt'>>,
): MatchRecord | null {
  const username = getAuthenticatedUsername();
  if (!username) return null;

  const records = getStudentMatchRecords();
  const index = records.findIndex(record => record.id === id);
  if (index === -1) return null;

  const updated = { ...records[index], ...updates };
  records[index] = updated;
  saveStudentMatchRecords(records);
  return updated;
}

export function deleteStudentMatchRecord(id: string): boolean {
  const username = getAuthenticatedUsername();
  if (!username) return false;

  const records = getStudentMatchRecords();
  const nextRecords = records.filter(record => record.id !== id);
  saveStudentMatchRecords(nextRecords);
  return true;
}

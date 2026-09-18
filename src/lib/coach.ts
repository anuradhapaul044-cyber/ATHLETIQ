import { getAuthenticatedUsername } from './auth';
import type { SavedPushupAssessment } from './assessments';
import type { MatchRecord } from './matchRecords';

export type CoachVerificationStatus = 'pending' | 'verified' | 'rejected';

export type CoachSavedAthlete = {
  athleteUsername: string;
  athleteName: string;
  savedAt: string;
};

export type CoachVerificationRecord = {
  athleteUsername: string;
  athleteName: string;
  athleteSport: string;
  status: CoachVerificationStatus;
  itemType: 'AI Assessment Result' | 'Match Record';
  metric: string;
  details: string;
  observation: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  savedAt: string;
};

export type AthleteDiscoveryEntry = {
  username: string;
  name: string;
  sport: string;
  location?: string;
  latestAssessment?: SavedPushupAssessment;
  matchRecords: MatchRecord[];
  verificationStatus: CoachVerificationStatus | 'none';
  saved: boolean;
};

export type CoachNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'saved' | 'verification' | 'opportunity';
};

function athleteStoragePrefix(): string { return 'athletiq_pushup_assessment_history:'; }
function matchStoragePrefix(): string { return 'athletiq_match_records:'; }
function locationStoragePrefix(): string { return 'athletiq_student_location:'; }
function savedAthletesStorageKey(coachUsername: string): string { return `athletiq_saved_athletes:${coachUsername}`; }
function verificationStorageKey(coachUsername: string, athleteUsername: string): string {
  return `athletiq_coach_verification:${coachUsername}:${athleteUsername}`;
}

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function getAthleteDisplayName(username: string): string {
  return username
    .split(/[._-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function getKnownAthleteUsernames(): string[] {
  const usernames = new Set<string>();

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(athleteStoragePrefix())) {
      const username = key.slice(athleteStoragePrefix().length);
      if (username) usernames.add(username);
    }
    if (key.startsWith(matchStoragePrefix())) {
      const username = key.slice(matchStoragePrefix().length);
      if (username) usernames.add(username);
    }
  }

  return Array.from(usernames).sort();
}

export function getLatestAthleteAssessment(username: string): SavedPushupAssessment | null {
  const storageKey = `${athleteStoragePrefix()}${username}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedPushupAssessment>[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const assessment = parsed[0] as Partial<SavedPushupAssessment>;
    if (
      typeof assessment?.completed_reps !== 'number'
      || typeof assessment?.incomplete_reps !== 'number'
      || typeof assessment?.pose_detection_percentage !== 'number'
      || !assessment?.movement_consistency
    ) {
      return null;
    }
    return assessment as SavedPushupAssessment;
  } catch {
    return null;
  }
}

export function getAthleteMatchRecords(username: string): MatchRecord[] {
  const storageKey = `${matchStoragePrefix()}${username}`;

  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const records = JSON.parse(raw) as Partial<MatchRecord>[];
    return ensureArray<MatchRecord>(records).filter((record): record is MatchRecord => (
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

export function getAthleteLocation(username: string): string | undefined {
  const raw = localStorage.getItem(`${locationStoragePrefix()}${username}`);
  if (!raw) return undefined;

  try {
    const location = JSON.parse(raw) as { location?: string };
    return typeof location.location === 'string' && location.location.trim() ? location.location.trim() : undefined;
  } catch {
    return undefined;
  }
}

export function getCoachSavedAthletes(): CoachSavedAthlete[] {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername) return [];

  try {
    const raw = localStorage.getItem(savedAthletesStorageKey(coachUsername));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CoachSavedAthlete>[];
    return ensureArray<CoachSavedAthlete>(parsed).filter((athlete): athlete is CoachSavedAthlete => (
      typeof athlete?.athleteUsername === 'string'
      && typeof athlete?.athleteName === 'string'
      && typeof athlete?.savedAt === 'string'
    ));
  } catch {
    return [];
  }
}

export function saveCoachAthlete(athleteUsername: string): boolean {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername || !athleteUsername) return false;

  const savedAthletes = getCoachSavedAthletes();
  const exists = savedAthletes.some((item) => item.athleteUsername === athleteUsername);
  if (exists) return true;

  const nextEntry: CoachSavedAthlete = {
    athleteUsername,
    athleteName: getAthleteDisplayName(athleteUsername),
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(savedAthletesStorageKey(coachUsername), JSON.stringify([nextEntry, ...savedAthletes]));
  return true;
}

export function removeCoachAthlete(athleteUsername: string): boolean {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername) return false;

  const savedAthletes = getCoachSavedAthletes().filter((entry) => entry.athleteUsername !== athleteUsername);
  localStorage.setItem(savedAthletesStorageKey(coachUsername), JSON.stringify(savedAthletes));
  return true;
}

export function getCoachVerificationRecord(athleteUsername: string): CoachVerificationRecord | null {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername || !athleteUsername) return null;

  try {
    const raw = localStorage.getItem(verificationStorageKey(coachUsername, athleteUsername));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CoachVerificationRecord>;
    if (
      typeof parsed?.athleteUsername !== 'string'
      || typeof parsed?.athleteName !== 'string'
      || typeof parsed?.athleteSport !== 'string'
      || !['pending', 'verified', 'rejected'].includes(parsed.status as string)
      || typeof parsed?.itemType !== 'string'
      || typeof parsed?.metric !== 'string'
      || typeof parsed?.details !== 'string'
      || typeof parsed?.observation !== 'string'
    ) {
      return null;
    }

    return parsed as CoachVerificationRecord;
  } catch {
    return null;
  }
}

export function setCoachVerificationStatus(
  athleteUsername: string,
  status: CoachVerificationStatus,
  observation = '',
): CoachVerificationRecord | null {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername || !athleteUsername) return null;

  const latestAssessment = getLatestAthleteAssessment(athleteUsername);
  const matchRecords = getAthleteMatchRecords(athleteUsername);
  const athleteSport = latestAssessment ? 'Athletics' : matchRecords[0]?.sport ?? 'Athletics';
  const athleteName = getAthleteDisplayName(athleteUsername);
  const metric = latestAssessment
    ? `Push-ups: ${latestAssessment.completed_reps} reps · Pose detection: ${latestAssessment.pose_detection_percentage.toFixed(1)}%`
    : matchRecords[0]
      ? `${matchRecords[0].sport}: ${matchRecords[0].result}`
      : 'No result recorded';

  const record: CoachVerificationRecord = {
    athleteUsername,
    athleteName,
    athleteSport,
    status,
    itemType: latestAssessment ? 'AI Assessment Result' : (matchRecords[0] ? 'Match Record' : 'AI Assessment Result'),
    metric,
    details: latestAssessment
      ? 'AI-assisted assessment result generated from video analysis and ready for coach attestation.'
      : 'This athlete has match record evidence pending coach review.',
    observation,
    reviewedBy: coachUsername,
    reviewedAt: new Date().toISOString(),
    savedAt: new Date().toISOString(),
  };

  localStorage.setItem(verificationStorageKey(coachUsername, athleteUsername), JSON.stringify(record));
  return record;
}

export function getCoachVerificationQueue(): CoachVerificationRecord[] {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername) return [];

  const athleteUsernames = new Set<string>([
    ...getKnownAthleteUsernames(),
    ...getCoachSavedAthletes().map((athlete) => athlete.athleteUsername),
  ]);

  return Array.from(athleteUsernames)
    .map((athleteUsername) => {
      const stored = getCoachVerificationRecord(athleteUsername);
      const latestAssessment = getLatestAthleteAssessment(athleteUsername);
      const matchRecords = getAthleteMatchRecords(athleteUsername);
      const athleteSport = latestAssessment ? 'Athletics' : matchRecords[0]?.sport ?? 'Athletics';
      const metric = latestAssessment
        ? `Push-ups: ${latestAssessment.completed_reps} reps · Pose detection: ${latestAssessment.pose_detection_percentage.toFixed(1)}%`
        : matchRecords[0]
          ? `${matchRecords[0].sport}: ${matchRecords[0].result}`
          : 'No result recorded';

      const details = latestAssessment
        ? 'AI-assisted assessment result generated from video analysis and ready for coach attestation.'
        : matchRecords[0]
          ? 'Match record available for coach review and attestation.'
          : 'No evidence is currently available for this athlete.';

      return stored ?? {
        athleteUsername,
        athleteName: getAthleteDisplayName(athleteUsername),
        athleteSport,
        status: 'pending',
        itemType: latestAssessment ? 'AI Assessment Result' : 'Match Record',
        metric,
        details,
        observation: '',
        reviewedBy: null,
        reviewedAt: null,
        savedAt: new Date().toISOString(),
      };
    })
    .filter((entry) => entry.metric !== 'No result recorded' || entry.status !== 'pending' || !entry.reviewedAt)
    .sort((left, right) => {
      const leftDate = left.reviewedAt ?? left.savedAt ?? '1970-01-01T00:00:00.000Z';
      const rightDate = right.reviewedAt ?? right.savedAt ?? '1970-01-01T00:00:00.000Z';
      return new Date(rightDate).getTime() - new Date(leftDate).getTime();
    });
}

export function getDiscoverableAthletes(): AthleteDiscoveryEntry[] {
  const coachUsername = getAuthenticatedUsername();
  const savedAthletes = new Set(getCoachSavedAthletes().map((entry) => entry.athleteUsername));

  return getKnownAthleteUsernames()
    .map((username) => {
      const latestAssessment = getLatestAthleteAssessment(username);
      const matchRecords = getAthleteMatchRecords(username);
      const location = getAthleteLocation(username);
      const verification = coachUsername ? getCoachVerificationRecord(username) : null;

      return {
        username,
        name: getAthleteDisplayName(username),
        sport: latestAssessment ? 'Athletics' : matchRecords[0]?.sport ?? 'Athletics',
        location,
        latestAssessment: latestAssessment ?? undefined,
        matchRecords,
        verificationStatus: verification?.status ?? 'none',
        saved: savedAthletes.has(username),
      };
    })
    .filter((athlete) => athlete.latestAssessment || athlete.matchRecords.length > 0)
    .sort((left, right) => {
      const leftScore = left.latestAssessment?.completed_reps ?? 0;
      const rightScore = right.latestAssessment?.completed_reps ?? 0;
      return rightScore - leftScore;
    });
}

export function getCoachNotifications(): CoachNotification[] {
  const coachUsername = getAuthenticatedUsername();
  if (!coachUsername) return [];

  const notifications: CoachNotification[] = [];

  const savedAthletes = getCoachSavedAthletes();
  for (const athlete of savedAthletes) {
    notifications.push({
      id: `saved-${athlete.athleteUsername}`,
      title: 'Saved athlete',
      message: `${athlete.athleteName} was added to your saved athlete list.`,
      createdAt: athlete.savedAt,
      type: 'saved',
    });
  }

  const verificationQueue = getCoachVerificationQueue();
  for (const record of verificationQueue) {
    if (record.status !== 'pending' && record.reviewedAt) {
      notifications.push({
        id: `verification-${record.athleteUsername}`,
        title: record.status === 'verified' ? 'Evidence verified' : 'Evidence needs review',
        message: `${record.athleteName}'s ${record.itemType.toLowerCase()} was ${record.status === 'verified' ? 'verified' : 'marked for review'} by ${coachUsername}.`,
        createdAt: record.reviewedAt,
        type: 'verification',
      });
    }
  }

  return notifications.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

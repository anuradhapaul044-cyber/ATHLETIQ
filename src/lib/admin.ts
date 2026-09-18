import type { UserRole } from './auth';
import { getCoachVerificationQueue } from './coach';
import { getOpportunities } from './opportunities';

export type PlatformUserStatus = 'active' | 'pending' | 'rejected' | 'verified';

export type PlatformUser = {
  username: string;
  role: UserRole;
  name: string;
  email: string;
  sport: string;
  location: string;
  status: PlatformUserStatus;
  joinedAt: string;
};

export type ActivityType = 'success' | 'warning' | 'danger' | 'info' | 'default';

export type ActivityEntry = {
  id: string;
  actor: string;
  role: UserRole | 'system';
  action: string;
  details: string;
  createdAt: string;
  type: ActivityType;
};

const USERS_KEY = 'athletiq_app_users';
const ACTIVITY_KEY = 'athletiq_app_activity';

function normalizeDisplayName(username: string): string {
  const safeUsername = username.trim();
  if (!safeUsername) return 'User';

  return safeUsername
    .replace(/[._-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return fallback;
  }
}

export function getAppUsers(): PlatformUser[] {
  const stored = safeRead<Partial<PlatformUser>[]>(USERS_KEY, []);
  if (!Array.isArray(stored)) return [];

  return stored.filter((user): user is PlatformUser => (
    typeof user?.username === 'string'
    && (user.role === 'student' || user.role === 'coach' || user.role === 'admin')
    && typeof user?.name === 'string'
    && typeof user?.email === 'string'
    && typeof user?.joinedAt === 'string'
    && typeof user?.status === 'string'
  ));
}

export function upsertAppUserRecord(input: Partial<PlatformUser> & Pick<PlatformUser, 'username' | 'role'>): void {
  const nextUsers = getAppUsers();
  const normalizedRecord: PlatformUser = {
    username: input.username.trim(),
    role: input.role,
    name: input.name?.trim() || normalizeDisplayName(input.username),
    email: input.email?.trim() || `${input.username.trim()}@athletiq.local`,
    sport: input.sport?.trim() || 'No data yet',
    location: input.location?.trim() || 'No data yet',
    status: input.status || (input.role === 'coach' ? 'pending' : 'active'),
    joinedAt: input.joinedAt || new Date().toISOString(),
  };

  const filtered = nextUsers.filter((user) => user.username !== normalizedRecord.username || user.role !== normalizedRecord.role);
  localStorage.setItem(USERS_KEY, JSON.stringify([normalizedRecord, ...filtered]));
}

export function setAppUserStatus(username: string, status: PlatformUserStatus): void {
  const users = getAppUsers();
  const updated = users.map((user) => user.username === username ? { ...user, status } : user);
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
}

export function getAdminDashboardStats() {
  const users = getAppUsers();
  const students = users.filter((user) => user.role === 'student').length;
  const coaches = users.filter((user) => user.role === 'coach').length;
  const pendingCoachVerifications = users.filter((user) => user.role === 'coach' && user.status === 'pending').length;
  const opportunities = getOpportunities().length;
  const assessments = Object.keys(localStorage).reduce((total, key) => {
    if (!key.startsWith('athletiq_pushup_assessment_history:')) return total;
    try {
      const value = JSON.parse(localStorage.getItem(key) ?? '[]');
      if (Array.isArray(value)) return total + value.length;
      return total;
    } catch {
      return total;
    }
  }, 0);

  return {
    totalStudents: students,
    totalCoaches: coaches,
    pendingCoachVerifications,
    totalAssessments: assessments,
    totalOpportunities: opportunities,
    recentActivity: getRecentActivity().slice(0, 5),
  };
}

export function getRecentActivity(): ActivityEntry[] {
  const stored = safeRead<ActivityEntry[]>(ACTIVITY_KEY, []);
  if (!Array.isArray(stored)) return [];

  return stored
    .filter((entry): entry is ActivityEntry => (
      typeof entry?.id === 'string'
      && typeof entry?.actor === 'string'
      && typeof entry?.action === 'string'
      && typeof entry?.details === 'string'
      && typeof entry?.createdAt === 'string'
    ))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addRecentActivity(input: Omit<ActivityEntry, 'id' | 'createdAt'>): void {
  const next = getRecentActivity();
  const entry: ActivityEntry = {
    ...input,
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(ACTIVITY_KEY, JSON.stringify([entry, ...next].slice(0, 35)));
}

export function getCoachReviewRecords() {
  const users = getAppUsers();
  const coaches = users.filter((user) => user.role === 'coach');
  const queue = getCoachVerificationQueue();

  return coaches.map((coach) => ({
    username: coach.username,
    name: coach.name,
    email: coach.email,
    sport: coach.sport,
    location: coach.location,
    status: coach.status,
    submittedAt: coach.joinedAt,
    evidence: queue.filter((entry) => entry.athleteUsername === coach.username).slice(0, 2),
  }));
}

export function getAdminReports() {
  const users = getAppUsers();
  const reports = [
    ...users.filter((user) => user.status === 'rejected').map((user) => ({
      id: `user-${user.username}`,
      type: 'User verification rejected',
      target: `${user.name} (${user.role})`,
      actor: 'System',
      date: user.joinedAt,
      status: 'resolved',
    })),
  ];

  return reports.length ? reports : [];
}

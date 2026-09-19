import { upsertAppUserRecord } from './admin';

const SESSION_KEY = 'athletiq_session';
const LEGACY_ACCESS_TOKEN_KEY = 'athletiq_access_token';

export type UserRole = 'student' | 'coach' | 'admin';

export type AuthUser = {
  username: string;
  role: UserRole;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

export function normalizeAuthUser(user?: Partial<AuthUser> | null): AuthUser | null {
  if (!user || typeof user.username !== 'string' || !user.username.trim()) return null;
  if (!isUserRole(user.role)) return null;

  return { username: user.username.trim(), role: user.role };
}

export function getRoleHomePath(role: UserRole): string {
  return `/${role}`;
}

type TokenPayload = {
  sub?: unknown;
  role?: unknown;
  exp?: unknown;
};

function decodeToken(token: string): TokenPayload | null {
  try {
    const encodedPayload = token.split('.')[1];
    if (!encodedPayload) return null;

    const base64 = encodedPayload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + ((4 - base64.length % 4) % 4), '=');
    return JSON.parse(atob(paddedBase64)) as TokenPayload;
  } catch {
    return null;
  }
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'student' || value === 'coach' || value === 'admin';
}

function sessionFromToken(accessToken: string): AuthSession | null {
  const payload = decodeToken(accessToken);
  const user = normalizeAuthUser({ username: typeof payload?.sub === 'string' ? payload.sub : undefined, role: payload?.role });
  if (!payload || !user) return null;
  if (typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now()) return null;

  return { accessToken, user };
}

export function saveAuthSession(accessToken: string, user: AuthUser): void {
  const normalizedUser = normalizeAuthUser(user);
  if (!normalizedUser) {
    clearAuthSession();
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ accessToken, user: normalizedUser }));
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);

  upsertAppUserRecord({
    username: normalizedUser.username,
    role: normalizedUser.role,
    name: normalizedUser.username,
    email: `${normalizedUser.username}@athletiq.local`,
    sport: 'No data yet',
    location: 'No data yet',
    status: normalizedUser.role === 'coach' ? 'pending' : 'active',
    joinedAt: new Date().toISOString(),
  });
}

export function getAuthSession(): AuthSession | null {
  try {
    const storedSession = localStorage.getItem(SESSION_KEY);
    if (storedSession) {
      const parsed = JSON.parse(storedSession) as Partial<AuthSession>;
      if (typeof parsed.accessToken === 'string') {
        const session = sessionFromToken(parsed.accessToken);
        if (session) return session;
      }
      clearAuthSession();
      return null;
    }

    const legacyToken = localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY);
    if (!legacyToken) return null;
    const session = sessionFromToken(legacyToken);
    if (!session) {
      clearAuthSession();
      return null;
    }
    saveAuthSession(session.accessToken, session.user);
    return session;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function getAccessToken(): string | null {
  return getAuthSession()?.accessToken ?? null;
}

export function getAuthenticatedUsername(): string | null {
  return getAuthSession()?.user.username ?? null;
}

export function clearAuthSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
}

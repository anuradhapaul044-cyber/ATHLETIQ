import { clearAuthSession, getAccessToken } from './auth';

export const API_BASE_URL = 'http://127.0.0.1:8000';

export class AuthenticationError extends Error {
  constructor(message = 'Your session has expired. Please sign in again.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

function redirectToLogin(): void {
  window.location.assign('/login');
}

export async function authenticatedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  if (!token) {
    redirectToLogin();
    throw new AuthenticationError();
  }

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 401) {
    clearAuthSession();
    redirectToLogin();
    throw new AuthenticationError();
  }

  return response;
}

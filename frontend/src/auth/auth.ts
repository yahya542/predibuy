import type { CurrentUser, TokenResponse } from 'types/predibuy';

const TOKEN_KEY = 'predibuy_access_token';
const USER_KEY = 'predibuy_user';

export function saveAuth(auth: TokenResponse, user: CurrentUser): void {
  localStorage.setItem(TOKEN_KEY, auth.access_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): CurrentUser | null {
  const user = localStorage.getItem(USER_KEY);
  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as CurrentUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.is_admin === true;
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

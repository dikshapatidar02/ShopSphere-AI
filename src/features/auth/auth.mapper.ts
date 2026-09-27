import type { AuthSession, User } from '@/types';

export function createMockSession(user: User, expiresInHours: number = 24): AuthSession {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInHours * 60 * 60 * 1000).toISOString();
  const token = `mock-jwt-token-${user.id}-${Math.random().toString(36).substring(2, 10)}`;

  return {
    user,
    token,
    expiresAt,
  };
}

export function isSessionExpired(session: AuthSession): boolean {
  if (!session.expiresAt) return false;
  return new Date(session.expiresAt).getTime() <= Date.now();
}

import { createMockSession, isSessionExpired } from '@/features/auth/auth.mapper';
import { getSafeStorage } from '@/lib/storage';
import type { AuthSession, User } from '@/types';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearSession, loadSession, saveSession } from '../session';

const dummyUser: User = {
  id: 'user-test-1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'customer',
  createdAt: new Date().toISOString(),
};

describe('Session Persistence & Expiration', () => {
  beforeEach(() => {
    clearSession();
  });

  it('should save and load session correctly', () => {
    const session = createMockSession(dummyUser, 24);
    saveSession(session);

    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded?.user.id).toBe('user-test-1');
  });

  it('should detect expired session and return null on load', () => {
    const expiredSession: AuthSession = {
      user: dummyUser,
      token: 'mock-token',
      expiresAt: new Date(Date.now() - 10000).toISOString(),
    };

    expect(isSessionExpired(expiredSession)).toBe(true);

    saveSession(expiredSession);
    const loaded = loadSession();
    expect(loaded).toBeNull();
  });

  it('should handle malformed storage data safely without crashing', () => {
    getSafeStorage().setItem('shopsphere_auth_session', 'invalid-json-content');
    const loaded = loadSession();
    expect(loaded).toBeNull();
  });
});

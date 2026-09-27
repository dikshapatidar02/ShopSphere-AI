import { isSessionExpired } from '@/features/auth/auth.mapper';
import { getSafeStorage } from '@/lib/storage';
import type { AuthSession } from '@/types';

const SESSION_STORAGE_KEY = 'shopsphere_auth_session';

export function saveSession(session: AuthSession): void {
  try {
    const data = JSON.stringify(session);
    getSafeStorage().setItem(SESSION_STORAGE_KEY, data);
  } catch {
    // Silently handle storage errors
  }
}

export function loadSession(): AuthSession | null {
  try {
    const raw = getSafeStorage().getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as AuthSession;
    if (!session || !session.user || !session.token) {
      clearSession();
      return null;
    }

    if (isSessionExpired(session)) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession(): void {
  try {
    getSafeStorage().removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function subscribeToSessionStorage(
  onSessionChanged: (session: AuthSession | null) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === SESSION_STORAGE_KEY) {
      const updatedSession = loadSession();
      onSessionChanged(updatedSession);
    }
  };

  window.addEventListener('storage', handleStorageEvent);
  return () => window.removeEventListener('storage', handleStorageEvent);
}

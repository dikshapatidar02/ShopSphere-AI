import { authService } from '@/features/auth/auth.service';
import { clearSession, loadSession, saveSession, subscribeToSessionStorage } from '@/lib/auth/session';
import type { AuthResult, AuthSession, AuthStatus, LoginCredentials, RegisterData, User } from '@/types';
import { create } from 'zustand';

export interface AuthStateValues {
  readonly user: User | null;
  readonly session: AuthSession | null;
  readonly status: AuthStatus;
  readonly isAuthenticated: boolean;
  readonly isHydrated: boolean;
  readonly error: string | null;
}

export interface AuthStoreActions {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  logout(): void;
  restoreSession(): Promise<void>;
  clearError(): void;
  setSession(session: AuthSession | null): void;
}

export type AuthStore = AuthStateValues & AuthStoreActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  status: 'idle',
  isAuthenticated: false,
  isHydrated: false,
  error: null,

  setSession: (session: AuthSession | null) => {
    if (session && session.user) {
      saveSession(session);
      set({
        user: session.user,
        session,
        status: 'authenticated',
        isAuthenticated: true,
        isHydrated: true,
        error: null,
      });
    } else {
      clearSession();
      set({
        user: null,
        session: null,
        status: 'unauthenticated',
        isAuthenticated: false,
        isHydrated: true,
        error: null,
      });
    }
  },

  login: async (credentials: LoginCredentials): Promise<AuthResult> => {
    set({ status: 'authenticating', error: null });
    const result = await authService.login(credentials);

    if (result.success) {
      get().setSession(result.session);
    } else {
      set({
        status: 'unauthenticated',
        error: result.error,
      });
    }
    return result;
  },

  register: async (data: RegisterData): Promise<AuthResult> => {
    set({ status: 'authenticating', error: null });
    const result = await authService.register(data);

    if (result.success) {
      get().setSession(result.session);
    } else {
      set({
        status: 'unauthenticated',
        error: result.error,
      });
    }
    return result;
  },

  logout: () => {
    get().setSession(null);
  },

  restoreSession: async () => {
    set({ status: 'hydrating' });
    const localSession = loadSession();

    if (!localSession) {
      set({
        user: null,
        session: null,
        status: 'unauthenticated',
        isAuthenticated: false,
        isHydrated: true,
      });
      return;
    }

    const isValid = await authService.validateSession(localSession);
    if (isValid) {
      set({
        user: localSession.user,
        session: localSession,
        status: 'authenticated',
        isAuthenticated: true,
        isHydrated: true,
      });
    } else {
      clearSession();
      set({
        user: null,
        session: null,
        status: 'unauthenticated',
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

// Setup cross-tab sync listener
if (typeof window !== 'undefined') {
  subscribeToSessionStorage((session) => {
    useAuthStore.getState().setSession(session);
  });
}

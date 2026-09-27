import type { User } from './user';

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterData {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export type AuthStatus =
  | 'idle'
  | 'hydrating'
  | 'authenticating'
  | 'authenticated'
  | 'unauthenticated'
  | 'error';

export interface AuthSession {
  readonly user: User;
  readonly token?: string;
  readonly expiresAt?: string;
}

export interface AuthState {
  readonly status: AuthStatus;
  readonly user: User | null;
  readonly session: AuthSession | null;
  readonly error: string | null;
}

export type AuthResult =
  | { readonly success: true; readonly session: AuthSession }
  | { readonly success: false; readonly error: string; readonly code?: string };

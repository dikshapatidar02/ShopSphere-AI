import type { AuthResult, AuthSession, LoginCredentials, RegisterData } from '@/types';

export interface IAuthProvider {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  validateSession(session: AuthSession): Promise<boolean>;
}

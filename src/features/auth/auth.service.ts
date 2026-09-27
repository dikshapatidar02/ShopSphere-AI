import type { AuthResult, AuthSession, LoginCredentials, RegisterData } from '@/types';
import type { IAuthProvider } from './auth.provider';
import { validateLoginCredentials, validateRegisterData } from './auth.validation';
import { MockAuthProvider } from './mock-auth.provider';

export class AuthService {
  constructor(private provider: IAuthProvider = new MockAuthProvider()) {}

  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    const val = validateLoginCredentials(credentials);
    if (!val.isValid) {
      const firstErr = Object.values(val.fieldErrors)[0] || 'Validation error';
      return {
        success: false,
        error: firstErr,
        code: 'VALIDATION_ERROR',
      };
    }

    return this.provider.login({
      email: credentials.email.trim(),
      password: credentials.password,
    });
  }

  public async register(data: RegisterData): Promise<AuthResult> {
    const val = validateRegisterData(data);
    if (!val.isValid) {
      const firstErr = Object.values(val.fieldErrors)[0] || 'Validation error';
      return {
        success: false,
        error: firstErr,
        code: 'VALIDATION_ERROR',
      };
    }

    return this.provider.register({
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    });
  }

  public async validateSession(session: AuthSession): Promise<boolean> {
    return this.provider.validateSession(session);
  }
}

export const authService = new AuthService();

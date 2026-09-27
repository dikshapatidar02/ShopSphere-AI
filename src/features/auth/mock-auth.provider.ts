import { MOCK_USERS } from '@/services/mocks/data/users.seed';
import type { AuthResult, AuthSession, LoginCredentials, RegisterData, User } from '@/types';
import { createMockSession, isSessionExpired } from './auth.mapper';
import type { IAuthProvider } from './auth.provider';

export class MockAuthProvider implements IAuthProvider {
  private users: User[];

  constructor(seedUsers: readonly User[] = MOCK_USERS) {
    this.users = [...seedUsers];
  }

  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    const emailNorm = credentials.email.trim().toLowerCase();
    const foundUser = this.users.find((u) => u.email.toLowerCase() === emailNorm);

    if (!foundUser) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    }

    // Mock validation: accept any non-empty password of length >= 6 for mock accounts
    if (!credentials.password || credentials.password.length < 6) {
      return {
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      };
    }

    const session = createMockSession(foundUser);
    return {
      success: true,
      session,
    };
  }

  public async register(data: RegisterData): Promise<AuthResult> {
    const emailNorm = data.email.trim().toLowerCase();
    const existing = this.users.find((u) => u.email.toLowerCase() === emailNorm);

    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists',
        code: 'EMAIL_ALREADY_EXISTS',
      };
    }

    const newUser: User = {
      id: `user-cust-${Date.now()}`,
      name: data.name.trim(),
      email: emailNorm,
      role: 'customer', // Registration ALWAYS defaults to customer
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    const session = createMockSession(newUser);

    return {
      success: true,
      session,
    };
  }

  public async validateSession(session: AuthSession): Promise<boolean> {
    if (!session || !session.user || !session.token) {
      return false;
    }
    if (isSessionExpired(session)) {
      return false;
    }
    const exists = this.users.some((u) => u.id === session.user.id);
    return exists;
  }
}

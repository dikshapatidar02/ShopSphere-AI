import { describe, expect, it } from 'vitest';
import { AuthService } from '../auth.service';
import { MockAuthProvider } from '../mock-auth.provider';

describe('AuthService & MockAuthProvider', () => {
  const service = new AuthService(new MockAuthProvider());

  it('should successfully log in with valid mock customer credentials', async () => {
    const res = await service.login({
      email: 'alex.johnson@example.com',
      password: 'password123',
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.session.user.role).toBe('customer');
      expect(res.session.user.email).toBe('alex.johnson@example.com');
      expect(res.session.token).toBeDefined();
    }
  });

  it('should successfully log in with valid mock admin credentials', async () => {
    const res = await service.login({
      email: 'admin.sarah@shopsphere.ai',
      password: 'adminpassword',
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.session.user.role).toBe('administrator');
    }
  });

  it('should fail login when password is too short or email is invalid', async () => {
    const res = await service.login({
      email: 'invalid-email',
      password: '123',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.code).toBe('VALIDATION_ERROR');
    }
  });

  it('should fail login with non-existent user email', async () => {
    const res = await service.login({
      email: 'nonexistent@example.com',
      password: 'password123',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain('Invalid email or password');
    }
  });

  it('should register new customer account successfully', async () => {
    const newEmail = `test.new.${Date.now()}@example.com`;
    const res = await service.register({
      name: 'John Doe',
      email: newEmail,
      password: 'password123',
    });

    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.session.user.name).toBe('John Doe');
      expect(res.session.user.role).toBe('customer');
    }
  });

  it('should prevent registration with duplicate email', async () => {
    const res = await service.register({
      name: 'Alex Dup',
      email: 'alex.johnson@example.com',
      password: 'password123',
    });

    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.code).toBe('EMAIL_ALREADY_EXISTS');
    }
  });
});

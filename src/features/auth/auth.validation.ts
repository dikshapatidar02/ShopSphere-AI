import type { LoginCredentials, RegisterData } from '@/types';

export interface ValidationResult {
  readonly isValid: boolean;
  readonly fieldErrors: Record<string, string>;
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}

export function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Full name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  return null;
}

export function validateLoginCredentials(credentials: LoginCredentials): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  const emailErr = validateEmail(credentials.email);
  if (emailErr) fieldErrors.email = emailErr;

  const passwordErr = validatePassword(credentials.password);
  if (passwordErr) fieldErrors.password = passwordErr;

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function validateRegisterData(data: RegisterData): ValidationResult {
  const fieldErrors: Record<string, string> = {};

  const nameErr = validateName(data.name);
  if (nameErr) fieldErrors.name = nameErr;

  const emailErr = validateEmail(data.email);
  if (emailErr) fieldErrors.email = emailErr;

  const passwordErr = validatePassword(data.password);
  if (passwordErr) fieldErrors.password = passwordErr;

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

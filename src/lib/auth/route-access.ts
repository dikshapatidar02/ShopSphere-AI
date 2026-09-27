import type { AuthSession, User, UserRole } from '@/types';
import { isSessionExpired } from '@/features/auth/auth.mapper';

export interface RouteAccessRule {
  readonly prefix: string;
  readonly requiresAuth: boolean;
  readonly requiredRole?: UserRole;
}

export const ROUTE_ACCESS_RULES: readonly RouteAccessRule[] = [
  { prefix: '/admin', requiresAuth: true, requiredRole: 'administrator' },
  { prefix: '/account', requiresAuth: true },
  { prefix: '/checkout', requiresAuth: true },
  { prefix: '/orders', requiresAuth: true },
];

export function isAuthenticated(session: AuthSession | null): boolean {
  if (!session || !session.user || !session.token) return false;
  return !isSessionExpired(session);
}

export function hasRole(user: User | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  return user.role === requiredRole;
}

/**
 * Checks whether a user/session has access to a given route path.
 * NOTE: Client-side access control only. Real security requires server-side validation.
 */
export function canAccess(
  path: string,
  user: User | null,
  session: AuthSession | null
): { readonly allowed: boolean; readonly reason?: string } {
  const rule = ROUTE_ACCESS_RULES.find((r) => path.startsWith(r.prefix));
  if (!rule) {
    return { allowed: true };
  }

  if (rule.requiresAuth && !isAuthenticated(session)) {
    return {
      allowed: false,
      reason: 'Authentication required to access this page',
    };
  }

  if (rule.requiredRole && !hasRole(user, rule.requiredRole)) {
    return {
      allowed: false,
      reason: `Role '${rule.requiredRole}' required to access this page`,
    };
  }

  return { allowed: true };
}

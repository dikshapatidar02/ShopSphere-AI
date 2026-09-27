import type { Address } from './address';

export type UserRole = 'customer' | 'administrator';

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly avatarUrl?: string;
  readonly phone?: string;
  readonly addresses?: readonly Address[];
  readonly createdAt: string;
  readonly updatedAt?: string;
}

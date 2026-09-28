import { getSafeStorage } from '@/lib/storage';
import { MOCK_USERS } from '@/services/mocks/data/users.seed';
import type { Address } from '@/types';

export interface AddressValidationError {
  readonly recipientName?: string;
  readonly line1?: string;
  readonly city?: string;
  readonly state?: string;
  readonly postalCode?: string;
  readonly country?: string;
  readonly phone?: string;
}

export function validateAddress(address: Partial<Address>): {
  isValid: boolean;
  errors: AddressValidationError;
} {
  const errors: Record<string, string> = {};

  if (!address.recipientName || address.recipientName.trim().length < 2) {
    errors.recipientName = 'Please enter a valid recipient name (min 2 characters).';
  }

  if (!address.line1 || address.line1.trim().length < 5) {
    errors.line1 = 'Please enter a street address (min 5 characters).';
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.city = 'Please enter a valid city.';
  }

  if (!address.state || address.state.trim().length < 2) {
    errors.state = 'Please enter a state or province.';
  }

  if (!address.postalCode || !/^[A-Za-z0-9\s-]{3,10}$/.test(address.postalCode.trim())) {
    errors.postalCode = 'Please enter a valid postal / ZIP code.';
  }

  if (!address.country || address.country.trim().length < 2) {
    errors.country = 'Please enter a country.';
  }

  if (address.phone && address.phone.trim().length > 0 && address.phone.trim().length < 7) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function getAddressStorageKey(userId: string | null): string {
  return `shopsphere_addresses_${userId || 'guest'}`;
}

export function loadUserAddresses(userId: string | null): Address[] {
  try {
    const raw = getSafeStorage().getItem(getAddressStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Seed fallback if user is in MOCK_USERS
    if (userId) {
      const seedUser = MOCK_USERS.find((u) => u.id === userId);
      if (seedUser?.addresses && seedUser.addresses.length > 0) {
        return [...seedUser.addresses];
      }
    }

    return [];
  } catch {
    return [];
  }
}

export function persistUserAddresses(userId: string | null, addresses: readonly Address[]): void {
  try {
    getSafeStorage().setItem(getAddressStorageKey(userId), JSON.stringify(addresses));
  } catch {
    // Ignore storage quota error
  }
}

import { getSafeStorage } from '@/lib/storage';

export interface AccountPreferences {
  readonly preferredCategories: readonly string[];
  readonly preferredBrands: readonly string[];
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly enablePersonalization: boolean;
  readonly showExplanations: boolean;
}

const STORAGE_PREFIX = 'shopsphere_account_preferences_';

export class PreferencesService {
  private getStorageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId || 'guest'}`;
  }

  public getPreferences(userId: string): AccountPreferences {
    if (!userId) return this.getDefaultPreferences();

    try {
      const raw = getSafeStorage().getItem(this.getStorageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          preferredCategories: Array.isArray(parsed.preferredCategories)
            ? parsed.preferredCategories
            : [],
          preferredBrands: Array.isArray(parsed.preferredBrands)
            ? parsed.preferredBrands
            : [],
          minPrice: typeof parsed.minPrice === 'number' ? parsed.minPrice : undefined,
          maxPrice: typeof parsed.maxPrice === 'number' ? parsed.maxPrice : undefined,
          enablePersonalization:
            typeof parsed.enablePersonalization === 'boolean'
              ? parsed.enablePersonalization
              : true,
          showExplanations:
            typeof parsed.showExplanations === 'boolean'
              ? parsed.showExplanations
              : true,
        };
      }
    } catch {
      // Fallback
    }

    return this.getDefaultPreferences();
  }

  public savePreferences(
    userId: string,
    preferences: AccountPreferences
  ): AccountPreferences {
    if (!userId) return preferences;

    try {
      getSafeStorage().setItem(this.getStorageKey(userId), JSON.stringify(preferences));
    } catch {
      // Fallback
    }

    return preferences;
  }

  private getDefaultPreferences(): AccountPreferences {
    return {
      preferredCategories: ['smartphones', 'laptops'],
      preferredBrands: ['TechCorp', 'AudioMax'],
      enablePersonalization: true,
      showExplanations: true,
    };
  }
}

export const preferencesService = new PreferencesService();

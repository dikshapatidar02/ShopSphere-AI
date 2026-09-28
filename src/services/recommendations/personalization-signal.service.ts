import { getSafeStorage } from '@/lib/storage';
import type { Product, UserPersonalizationSignals } from '@/types';

function getSignalStorageKey(userId: string | null): string {
  return `shopsphere_signals_${userId || 'guest'}`;
}

export function loadUserPersonalizationSignals(
  userId: string | null
): UserPersonalizationSignals {
  try {
    const raw = getSafeStorage().getItem(getSignalStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          recentlyViewedProductIds: Array.isArray(parsed.recentlyViewedProductIds)
            ? parsed.recentlyViewedProductIds
            : [],
          recentSearchQueries: Array.isArray(parsed.recentSearchQueries)
            ? parsed.recentSearchQueries
            : [],
          wishlistProductIds: Array.isArray(parsed.wishlistProductIds)
            ? parsed.wishlistProductIds
            : [],
          cartProductIds: Array.isArray(parsed.cartProductIds)
            ? parsed.cartProductIds
            : [],
          purchasedProductIds: Array.isArray(parsed.purchasedProductIds)
            ? parsed.purchasedProductIds
            : [],
          preferredCategories:
            typeof parsed.preferredCategories === 'object' && parsed.preferredCategories !== null
              ? parsed.preferredCategories
              : {},
          preferredBrands:
            typeof parsed.preferredBrands === 'object' && parsed.preferredBrands !== null
              ? parsed.preferredBrands
              : {},
          pricePreference: parsed.pricePreference || undefined,
          minRatingPreference: parsed.minRatingPreference || undefined,
        };
      }
    }
  } catch {
    // Fallback to empty signals
  }

  return {
    recentlyViewedProductIds: [],
    recentSearchQueries: [],
    wishlistProductIds: [],
    cartProductIds: [],
    purchasedProductIds: [],
    preferredCategories: {},
    preferredBrands: {},
  };
}

export function persistUserPersonalizationSignals(
  userId: string | null,
  signals: UserPersonalizationSignals
): void {
  try {
    getSafeStorage().setItem(getSignalStorageKey(userId), JSON.stringify(signals));
  } catch {
    // Ignore storage quota errors
  }
}

export class PersonalizationSignalService {
  public getSignals(
    userId: string | null = null,
    cartProductIds: readonly string[] = [],
    wishlistProductIds: readonly string[] = [],
    purchasedProductIds: readonly string[] = []
  ): UserPersonalizationSignals {
    const saved = loadUserPersonalizationSignals(userId);
    return {
      ...saved,
      cartProductIds: Array.from(new Set([...saved.cartProductIds, ...cartProductIds])),
      wishlistProductIds: Array.from(new Set([...saved.wishlistProductIds, ...wishlistProductIds])),
      purchasedProductIds: Array.from(new Set([...saved.purchasedProductIds, ...purchasedProductIds])),
    };
  }

  public recordProductView(product: Product, userId: string | null = null): UserPersonalizationSignals {
    const current = loadUserPersonalizationSignals(userId);

    // Newest view first, deduplicated
    const filteredViews = current.recentlyViewedProductIds.filter((id) => id !== product.id);
    const updatedViews = [product.id, ...filteredViews].slice(0, 20);

    // Increment category & brand affinity
    const cat = product.category;
    const brand = product.brand;

    const preferredCategories = {
      ...current.preferredCategories,
      [cat]: (current.preferredCategories[cat] || 0) + 1,
    };

    const preferredBrands = {
      ...current.preferredBrands,
      [brand]: (current.preferredBrands[brand] || 0) + 1,
    };

    // Calculate rolling average viewed price
    const prevAvg = current.pricePreference?.averageViewedPrice ?? product.discountedPrice;
    const newAvg = Math.round((prevAvg * 0.7 + product.discountedPrice * 0.3) * 100) / 100;

    const updatedSignals: UserPersonalizationSignals = {
      ...current,
      recentlyViewedProductIds: updatedViews,
      preferredCategories,
      preferredBrands,
      pricePreference: {
        min: Math.min(current.pricePreference?.min ?? product.discountedPrice, product.discountedPrice),
        max: Math.max(current.pricePreference?.max ?? product.discountedPrice, product.discountedPrice),
        averageViewedPrice: newAvg,
      },
    };

    persistUserPersonalizationSignals(userId, updatedSignals);
    return updatedSignals;
  }

  public recordSearchQuery(query: string, category?: string, userId: string | null = null): UserPersonalizationSignals {
    const normalized = query.trim().toLowerCase();
    if (!normalized || normalized.length < 2) {
      return loadUserPersonalizationSignals(userId);
    }

    const current = loadUserPersonalizationSignals(userId);
    const filteredSearches = current.recentSearchQueries.filter((q) => q !== normalized);
    const updatedSearches = [normalized, ...filteredSearches].slice(0, 10);

    const updatedSignals: UserPersonalizationSignals = {
      ...current,
      recentSearchQueries: updatedSearches,
    };

    persistUserPersonalizationSignals(userId, updatedSignals);
    return updatedSignals;
  }
}

export const personalizationSignalService = new PersonalizationSignalService();
export const personalizationSignalTracker = personalizationSignalService;


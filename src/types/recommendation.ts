import type { Product } from './product';

export type RecommendationStrategy =
  | 'recently_viewed'
  | 'similar_products'
  | 'category_based'
  | 'price_based'
  | 'wishlist_based'
  | 'cart_based'
  | 'frequently_bought_together'
  | 'trending'
  | 'personalized_for_you';

export interface UserPersonalizationSignals {
  readonly recentlyViewedProductIds: readonly string[];
  readonly recentSearchQueries: readonly string[];
  readonly wishlistProductIds: readonly string[];
  readonly cartProductIds: readonly string[];
  readonly purchasedProductIds: readonly string[];
  readonly preferredCategories: Record<string, number>;
  readonly preferredBrands: Record<string, number>;
  readonly pricePreference?: {
    readonly min?: number;
    readonly max?: number;
    readonly averageViewedPrice?: number;
  };
  readonly minRatingPreference?: number;
}

export interface RecommendationContext {
  readonly productId?: string;
  readonly categorySlug?: string;
  readonly userId?: string;
  readonly limit?: number;
  readonly userSignals?: UserPersonalizationSignals;
  readonly currentCartProductIds?: readonly string[];
  readonly currentWishlistProductIds?: readonly string[];
}

export interface RecommendationItem {
  readonly product: Product;
  readonly strategy: RecommendationStrategy;
  readonly score: number;
  readonly explanation: string;
  readonly ranking: number;
}

export interface RecommendationResponse {
  readonly strategy: RecommendationStrategy;
  readonly title: string;
  readonly subtitle?: string;
  readonly items: readonly RecommendationItem[];
  readonly total: number;
}

export interface RecommendationProviderContract {
  getRecommendations(
    context: RecommendationContext,
    strategy: RecommendationStrategy
  ): Promise<RecommendationResponse>;
}

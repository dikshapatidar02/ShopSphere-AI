import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';

export interface ScoredCandidate {
  readonly product: Product;
  readonly rawScore: number;
  readonly explanationReason: string;
}

export interface IRecommendationStrategy {
  readonly type: RecommendationStrategy;

  generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[];
}

/**
 * Centralized Scoring Weights Configuration
 * Documented weights for deterministic multi-signal recommendation scoring.
 */
export const RECOMMENDATION_WEIGHTS = {
  // Category match (Strongest domain indicator)
  CATEGORY_MATCH: 40,

  // Brand match (Moderate loyalty indicator)
  BRAND_MATCH: 20,

  // Price similarity proximity (Up to 20 pts)
  MAX_PRICE_PROXIMITY: 20,

  // Rating quality (Up to 10 pts: rating / 5 * 10)
  MAX_RATING_SCORE: 10,

  // Tag / Attribute overlap (Up to 10 pts)
  MAX_TAG_OVERLAP: 10,

  // Wishlist & Cart affinity bonus
  WISHLIST_AFFINITY_BONUS: 15,
  CART_COMPLEMENTARY_BONUS: 15,
  PURCHASE_HISTORY_BONUS: 20,
} as const;

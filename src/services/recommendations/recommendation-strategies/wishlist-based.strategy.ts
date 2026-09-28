import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class WishlistBasedStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'wishlist_based';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const wishlistIds = new Set(
      context.currentWishlistProductIds || context.userSignals?.wishlistProductIds || []
    );

    if (wishlistIds.size === 0) return [];

    const wishlistProducts = allProducts.filter((p) => wishlistIds.has(p.id));
    const wishlistCategories = new Set(wishlistProducts.map((p) => p.category));
    const wishlistBrands = new Set(wishlistProducts.map((p) => p.brand).filter(Boolean));

    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (wishlistIds.has(product.id) || product.id === context.productId) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      let score = 0;
      const reasons: string[] = [];

      if (wishlistCategories.has(product.category)) {
        score += 45;
        reasons.push(`Related to your wishlist in ${product.categoryName || product.category}`);
      }

      if (wishlistBrands.has(product.brand)) {
        score += 25;
        reasons.push(`Same brand as your saved item (${product.brand})`);
      }

      score += product.rating * 5;

      if (score > 20) {
        candidates.push({
          product,
          rawScore: Math.round(score * 10) / 10,
          explanationReason: reasons.length > 0 ? reasons[0] : 'Based on items in your wishlist',
        });
      }
    });

    return candidates;
  }
}

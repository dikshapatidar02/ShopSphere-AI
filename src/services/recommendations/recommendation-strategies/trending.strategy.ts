import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class TrendingStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'trending';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (product.id === context.productId) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      // Deterministic trending calculation
      const score = Math.round(
        ((product.rating || 4) * 12 +
          (product.reviewCount || 10) * 0.4 +
          (product.discountPercentage || 0) * 0.3 +
          (product.isFeatured ? 20 : 0)) *
          10
      ) / 10;

      candidates.push({
        product,
        rawScore: score,
        explanationReason: `Trending now with ${product.rating.toFixed(1)}★ rating (${product.reviewCount} reviews)`,
      });
    });

    return candidates;
  }
}

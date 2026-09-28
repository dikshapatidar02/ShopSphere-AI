import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class RecentlyViewedStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'recently_viewed';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const recentIds = context.userSignals?.recentlyViewedProductIds || [];
    if (recentIds.length === 0) return [];

    const productsMap = new Map(allProducts.map((p) => [p.id, p]));
    const candidates: ScoredCandidate[] = [];

    recentIds.forEach((id, index) => {
      if (id === context.productId) return;
      const product = productsMap.get(id);
      if (!product || product.stock === 0 || product.availability === 'out_of_stock') return;

      // Deterministic score descending by recency order (max 100)
      const score = Math.max(10, 100 - index * 5);

      candidates.push({
        product,
        rawScore: score,
        explanationReason: 'Recently viewed by you',
      });
    });

    return candidates;
  }
}

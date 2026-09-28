import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class FrequentlyBoughtTogetherStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'frequently_bought_together';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const targetProduct = allProducts.find((p) => p.id === context.productId);
    const cartIds = new Set(context.currentCartProductIds || []);

    const sourceProducts = targetProduct
      ? [targetProduct]
      : allProducts.filter((p) => cartIds.has(p.id));

    if (sourceProducts.length === 0) return [];

    const sourceIds = new Set(sourceProducts.map((p) => p.id));
    const sourceCategories = new Set(sourceProducts.map((p) => p.category));
    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (sourceIds.has(product.id) || cartIds.has(product.id)) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      let score = 0;
      let reason = 'Frequently bought together';

      // 1. Exact Category pairing
      if (sourceCategories.has(product.category)) {
        score += 50;
        if (targetProduct) {
          reason = `Frequently bought together with ${targetProduct.title}`;
        }
      }

      // 2. High rating bonus
      score += product.rating * 8;

      if (score > 30) {
        candidates.push({
          product,
          rawScore: Math.round(score * 10) / 10,
          explanationReason: reason,
        });
      }
    });

    return candidates;
  }
}

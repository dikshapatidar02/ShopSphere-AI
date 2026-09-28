import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class PriceBasedStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'price_based';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const targetProduct = allProducts.find((p) => p.id === context.productId);
    const targetPrice =
      targetProduct?.discountedPrice ||
      context.userSignals?.pricePreference?.averageViewedPrice ||
      100;

    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (product.id === context.productId) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      const priceDiffRatio = Math.abs(product.discountedPrice - targetPrice) / targetPrice;
      if (priceDiffRatio > 0.45) return; // Only include items within reasonable range

      const score = Math.round((Math.max(0, 1 - priceDiffRatio) * 70 + product.rating * 6) * 10) / 10;

      candidates.push({
        product,
        rawScore: score,
        explanationReason: `Fits your price budget around $${Math.round(targetPrice)}`,
      });
    });

    return candidates;
  }
}

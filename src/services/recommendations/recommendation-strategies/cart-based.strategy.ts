import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class CartBasedStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'cart_based';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const cartIds = new Set(
      context.currentCartProductIds || context.userSignals?.cartProductIds || []
    );

    if (cartIds.size === 0) return [];

    const cartProducts = allProducts.filter((p) => cartIds.has(p.id));
    const cartCategories = new Set(cartProducts.map((p) => p.category));
    const cartBrands = new Set(cartProducts.map((p) => p.brand).filter(Boolean));

    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (cartIds.has(product.id) || product.id === context.productId) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      let score = 0;
      const reasons: string[] = [];

      if (cartCategories.has(product.category)) {
        score += 40;
        reasons.push(`Complements items in your cart (${product.categoryName || product.category})`);
      }

      if (cartBrands.has(product.brand)) {
        score += 25;
        reasons.push(`Matching brand (${product.brand})`);
      }

      score += product.rating * 5;

      if (score > 15) {
        candidates.push({
          product,
          rawScore: Math.round(score * 10) / 10,
          explanationReason: reasons.length > 0 ? reasons[0] : 'Recommended to complement your cart',
        });
      }
    });

    return candidates;
  }
}

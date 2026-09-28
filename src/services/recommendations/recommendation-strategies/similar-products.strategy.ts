import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import { RECOMMENDATION_WEIGHTS, type IRecommendationStrategy, type ScoredCandidate } from './strategy.interface';

export class SimilarProductsStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'similar_products';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const sourceProduct = allProducts.find((p) => p.id === context.productId);
    if (!sourceProduct) return [];

    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (product.id === sourceProduct.id) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      let score = 0;
      const reasons: string[] = [];

      // 1. Category match
      if (product.category === sourceProduct.category) {
        score += RECOMMENDATION_WEIGHTS.CATEGORY_MATCH;
        reasons.push(`Same ${sourceProduct.categoryName || sourceProduct.category} category`);
      }

      // 2. Brand match
      if (product.brand && product.brand === sourceProduct.brand) {
        score += RECOMMENDATION_WEIGHTS.BRAND_MATCH;
        reasons.push(`Same brand (${sourceProduct.brand})`);
      }

      // 3. Price proximity
      if (sourceProduct.discountedPrice > 0) {
        const priceDiffRatio = Math.abs(product.discountedPrice - sourceProduct.discountedPrice) / sourceProduct.discountedPrice;
        const priceScore = Math.max(0, 1 - priceDiffRatio) * RECOMMENDATION_WEIGHTS.MAX_PRICE_PROXIMITY;
        score += priceScore;
        if (priceDiffRatio < 0.2) {
          reasons.push('Similar price range');
        }
      }

      // 4. Rating quality
      score += (product.rating / 5) * RECOMMENDATION_WEIGHTS.MAX_RATING_SCORE;

      // 5. Tag overlap
      const sourceTags = new Set(sourceProduct.tags || []);
      if (sourceTags.size > 0 && product.tags) {
        const matchingTags = product.tags.filter((t) => sourceTags.has(t));
        const tagRatio = matchingTags.length / sourceTags.size;
        score += tagRatio * RECOMMENDATION_WEIGHTS.MAX_TAG_OVERLAP;
      }

      if (score > 15) {
        candidates.push({
          product,
          rawScore: Math.round(score * 10) / 10,
          explanationReason: reasons.length > 0 ? reasons.join(' • ') : `Similar to ${sourceProduct.title}`,
        });
      }
    });

    return candidates;
  }
}

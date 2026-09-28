import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class PersonalizedForYouStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'personalized_for_you';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const signals = context.userSignals;

    const hasViews = (signals?.recentlyViewedProductIds?.length || 0) > 0;
    const hasWishlist = (signals?.wishlistProductIds?.length || 0) > 0;
    const hasCart = (signals?.cartProductIds?.length || 0) > 0;
    const hasSearches = (signals?.recentSearchQueries?.length || 0) > 0;
    const isColdStart = !hasViews && !hasWishlist && !hasCart && !hasSearches;

    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (product.id === context.productId) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      if (isColdStart) {
        // Cold-Start Fallback scoring based on rating and reviews
        const coldScore = Math.round((product.rating * 15 + (product.reviewCount || 0) * 0.3) * 10) / 10;
        candidates.push({
          product,
          rawScore: coldScore,
          explanationReason: 'Top-rated selection recommended for you',
        });
        return;
      }

      let score = 0;
      const reasons: string[] = [];

      // Category affinity (30 pts max)
      const catCount = signals?.preferredCategories?.[product.category] || 0;
      if (catCount > 0) {
        score += Math.min(30, catCount * 10);
        reasons.push(`Matches your interest in ${product.categoryName || product.category}`);
      }

      // Brand affinity (20 pts max)
      const brandCount = signals?.preferredBrands?.[product.brand] || 0;
      if (brandCount > 0) {
        score += Math.min(20, brandCount * 10);
        reasons.push(`From your preferred brand (${product.brand})`);
      }

      // Price proximity (20 pts max)
      if (signals?.pricePreference?.averageViewedPrice) {
        const avgPrice = signals.pricePreference.averageViewedPrice;
        const diffRatio = Math.abs(product.discountedPrice - avgPrice) / avgPrice;
        score += Math.max(0, 1 - diffRatio) * 20;
      }

      // Rating (15 pts max)
      score += (product.rating / 5) * 15;

      // Interaction bonuses
      if (signals?.wishlistProductIds?.includes(product.id)) {
        score += 15;
      }

      if (score > 10) {
        candidates.push({
          product,
          rawScore: Math.round(score * 10) / 10,
          explanationReason: reasons.length > 0 ? reasons[0] : 'Personalized based on your shopping activity',
        });
      }
    });

    return candidates;
  }
}

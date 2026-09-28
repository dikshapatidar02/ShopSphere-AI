import type { Product, RecommendationContext, RecommendationStrategy } from '@/types';
import type { IRecommendationStrategy, ScoredCandidate } from './strategy.interface';

export class CategoryBasedStrategy implements IRecommendationStrategy {
  public readonly type: RecommendationStrategy = 'category_based';

  public generateCandidates(
    context: RecommendationContext,
    allProducts: readonly Product[]
  ): ScoredCandidate[] {
    const targetCategory =
      context.categorySlug ||
      Object.entries(context.userSignals?.preferredCategories || {}).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0];

    const candidates: ScoredCandidate[] = [];

    allProducts.forEach((product) => {
      if (product.id === context.productId) return;
      if (product.stock === 0 || product.availability === 'out_of_stock') return;

      const categoryMatch = targetCategory
        ? product.category.toLowerCase() === targetCategory.toLowerCase()
        : true;

      if (!categoryMatch) return;

      const categoryAffinity = context.userSignals?.preferredCategories[product.category] || 1;
      const score = Math.round((categoryAffinity * 20 + product.rating * 10 + (product.reviewCount || 0) * 0.2) * 10) / 10;

      candidates.push({
        product,
        rawScore: score,
        explanationReason: `Popular in ${product.categoryName || product.category}`,
      });
    });

    return candidates;
  }
}

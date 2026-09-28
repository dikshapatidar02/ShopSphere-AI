import type { RecommendationContext } from '@/types';
import type { ScoredCandidate } from './recommendation-strategies/strategy.interface';

/**
 * Candidate Filter & Deduplicator module.
 * Ensures recommendation candidates are valid, in-stock, non-duplicate,
 * and exclude current source product if specified.
 */
export class RecommendationCandidates {
  /**
   * Filters candidates against context constraints & business rules.
   */
  public static filterCandidates(
    candidates: readonly ScoredCandidate[],
    context: RecommendationContext
  ): ScoredCandidate[] {
    const { productId: excludeProductId } = context;

    return candidates.filter((candidate) => {
      const product = candidate.product;

      // 1. Check valid product object
      if (!product || !product.id || typeof product.price !== 'number') {
        return false;
      }

      // 2. Exclude source/current product if specified
      if (excludeProductId && product.id === excludeProductId) {
        return false;
      }

      // 3. Exclude out-of-stock or unlisted products
      if (product.stock !== undefined && product.stock <= 0) {
        return false;
      }

      return true;
    });
  }

  /**
   * Deduplicates candidates by Product ID, keeping the entry with the highest rawScore.
   */
  public static deduplicateCandidates(
    candidates: readonly ScoredCandidate[]
  ): ScoredCandidate[] {
    const map = new Map<string, ScoredCandidate>();

    for (const candidate of candidates) {
      const existing = map.get(candidate.product.id);
      if (!existing || candidate.rawScore > existing.rawScore) {
        map.set(candidate.product.id, candidate);
      }
    }

    return Array.from(map.values());
  }
}

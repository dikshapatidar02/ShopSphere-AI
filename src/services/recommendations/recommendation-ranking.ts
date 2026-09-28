import type { ScoredCandidate } from './recommendation-strategies/strategy.interface';

export interface RankedItem {
  readonly candidate: ScoredCandidate;
  readonly normalizedScore: number;
  readonly rank: number;
}

/**
 * Normalizes recommendation candidate scores and sorts them deterministically.
 */
export class RecommendationRanking {
  /**
   * Normalizes and ranks candidates deterministically.
   * Higher score = better ranking.
   * Tie-breakers: product rating (desc), reviews count (desc), product ID (asc).
   */
  public static rankCandidates(
    candidates: readonly ScoredCandidate[]
  ): RankedItem[] {
    if (candidates.length === 0) {
      return [];
    }

    // Find max score for scaling to 0 - 100 range
    const maxScore = Math.max(...candidates.map((c) => c.rawScore), 1);

    // Sort deterministically
    const sorted = [...candidates].sort((a, b) => {
      if (b.rawScore !== a.rawScore) {
        return b.rawScore - a.rawScore;
      }

      // Tie-breaker 1: Rating
      const ratingA = a.product.rating ?? 0;
      const ratingB = b.product.rating ?? 0;
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }

      // Tie-breaker 2: Product ID determinism
      return a.product.id.localeCompare(b.product.id);
    });

    return sorted.map((candidate, index) => {
      const normalizedScore = Math.min(
        100,
        Math.max(0, Math.round((candidate.rawScore / maxScore) * 100))
      );

      return {
        candidate,
        normalizedScore,
        rank: index + 1,
      };
    });
  }
}

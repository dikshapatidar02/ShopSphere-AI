import type { AssistantActiveContext, ExtractedEntities } from '@/types/assistant';

/**
 * Handles deterministic context refinement for follow-up shopping queries.
 */
export class RefinementHandler {
  public static refine(
    previousContext: AssistantActiveContext = {},
    newEntities: ExtractedEntities,
    rawText: string
  ): AssistantActiveContext {
    const text = rawText.toLowerCase();

    const updated: AssistantActiveContext = {
      ...previousContext,
      page: previousContext.page ?? 1,
    };

    // 1. Category replacement
    if (newEntities.category) {
      return {
        ...updated,
        category: newEntities.category,
        page: 1,
      };
    }

    // 2. Relative "Something cheaper"
    if (/\b(cheaper|lower price|less expensive)\b/i.test(text)) {
      let currentPrice = previousContext.maxPrice;
      if (!currentPrice && previousContext.currentResults?.length) {
        const prices = previousContext.currentResults.map((p) => p.discountedPrice);
        currentPrice = Math.min(...prices);
      }

      const newMax = currentPrice ? Math.round(currentPrice * 0.75) : 1000;
      return {
        ...updated,
        maxPrice: newMax,
        page: 1,
      };
    }

    // 3. Relative "Better ratings"
    if (/\b(better ratings|higher ratings|best rated|top rated)\b/i.test(text)) {
      const newRating = Math.min(5, Math.max(4.5, (previousContext.minRating ?? 4.0) + 0.5));
      return {
        ...updated,
        minRating: newRating,
        sortBy: 'rating_desc',
        page: 1,
      };
    }

    // 4. Absolute price refinement
    if (newEntities.maxPrice !== undefined || newEntities.minPrice !== undefined) {
      return {
        ...updated,
        maxPrice: newEntities.maxPrice ?? updated.maxPrice,
        minPrice: newEntities.minPrice ?? updated.minPrice,
        page: 1,
      };
    }

    // 5. Brand refinement
    if (newEntities.brand) {
      return {
        ...updated,
        brand: newEntities.brand,
        page: 1,
      };
    }

    // 6. Color refinement
    if (newEntities.color) {
      return {
        ...updated,
        color: newEntities.color,
        page: 1,
      };
    }

    // 7. Sort refinement
    if (newEntities.sortBy) {
      return {
        ...updated,
        sortBy: newEntities.sortBy,
        page: 1,
      };
    }

    return updated;
  }
}

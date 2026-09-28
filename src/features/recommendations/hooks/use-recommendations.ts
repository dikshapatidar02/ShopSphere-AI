'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  RecommendationContext,
  RecommendationResponse,
  RecommendationStrategy,
} from '@/types';
import { recommendationService } from '@/services/recommendations';

export interface UseRecommendationsOptions {
  readonly strategy: RecommendationStrategy;
  readonly context?: RecommendationContext;
  readonly enabled?: boolean;
}

/**
 * TanStack Query hook for fetching explainable, deterministic recommendations.
 */
export function useRecommendations({
  strategy,
  context = {},
  enabled = true,
}: UseRecommendationsOptions) {
  // Normalize context for stable query keys
  const queryKey = [
    'recommendations',
    strategy,
    {
      productId: context.productId ?? null,
      categorySlug: context.categorySlug ?? null,
      userId: context.userId ?? null,
      limit: context.limit ?? 8,
      cartCount: context.currentCartProductIds?.length ?? 0,
      wishlistCount: context.currentWishlistProductIds?.length ?? 0,
    },
  ];

  return useQuery<RecommendationResponse, Error>({
    queryKey,
    queryFn: async () => {
      return recommendationService.getRecommendations(context, strategy);
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
}

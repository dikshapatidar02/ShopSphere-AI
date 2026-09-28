import type {
  RecommendationContext,
  RecommendationProviderContract,
  RecommendationResponse,
  RecommendationStrategy,
} from '@/types';

export interface IRecommendationProvider extends RecommendationProviderContract {
  getRecommendations(
    context: RecommendationContext,
    strategy: RecommendationStrategy
  ): Promise<RecommendationResponse>;
}

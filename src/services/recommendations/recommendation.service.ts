import type {
  RecommendationContext,
  RecommendationResponse,
  RecommendationStrategy,
} from '@/types';
import type { IRecommendationProvider } from './recommendation.provider';
import { MockRecommendationProvider } from './mock-recommendation.provider';
import { personalizationSignalTracker } from './personalization-signal.service';

/**
 * Recommendation Service facade.
 * Orchestrates provider calls, attaches local user personalization signals,
 * and provides high-level helper methods for different recommendation strategies.
 */
export class RecommendationService {
  constructor(
    private readonly provider: IRecommendationProvider = new MockRecommendationProvider()
  ) {}

  /**
   * Get recommendations using specific strategy and context.
   */
  public async getRecommendations(
    context: RecommendationContext,
    strategy: RecommendationStrategy
  ): Promise<RecommendationResponse> {
    const fullContext: RecommendationContext = {
      ...context,
      userSignals: context.userSignals ?? personalizationSignalTracker.getSignals(context.userId ?? null),
    };

    return this.provider.getRecommendations(fullContext, strategy);
  }

  /**
   * Helper: Get Similar Products for a given product ID / item.
   */
  public async getSimilarProducts(
    productId: string,
    categorySlug?: string,
    limit: number = 8
  ): Promise<RecommendationResponse> {
    return this.getRecommendations(
      { productId, categorySlug, limit },
      'similar_products'
    );
  }

  /**
   * Helper: Get Personalised Recommendations for User.
   */
  public async getPersonalizedForYou(
    userId?: string,
    limit: number = 8
  ): Promise<RecommendationResponse> {
    return this.getRecommendations({ userId, limit }, 'personalized_for_you');
  }

  /**
   * Helper: Get Frequently Bought Together recommendations based on PDP product or Cart.
   */
  public async getFrequentlyBoughtTogether(
    productId?: string,
    cartProductIds?: readonly string[],
    limit: number = 4
  ): Promise<RecommendationResponse> {
    return this.getRecommendations(
      { productId, currentCartProductIds: cartProductIds, limit },
      'frequently_bought_together'
    );
  }

  /**
   * Helper: Get Trending Products.
   */
  public async getTrending(limit: number = 8): Promise<RecommendationResponse> {
    return this.getRecommendations({ limit }, 'trending');
  }
}

export const recommendationService = new RecommendationService();

import type {
  Product,
  RecommendationContext,
  RecommendationItem,
  RecommendationResponse,
  RecommendationStrategy,
} from '@/types';
import type { IRecommendationStrategy } from './recommendation-strategies/strategy.interface';
import { RecentlyViewedStrategy } from './recommendation-strategies/recently-viewed.strategy';
import { SimilarProductsStrategy } from './recommendation-strategies/similar-products.strategy';
import { CategoryBasedStrategy } from './recommendation-strategies/category-based.strategy';
import { PriceBasedStrategy } from './recommendation-strategies/price-based.strategy';
import { WishlistBasedStrategy } from './recommendation-strategies/wishlist-based.strategy';
import { CartBasedStrategy } from './recommendation-strategies/cart-based.strategy';
import { FrequentlyBoughtTogetherStrategy } from './recommendation-strategies/frequently-bought-together.strategy';
import { TrendingStrategy } from './recommendation-strategies/trending.strategy';
import { PersonalizedForYouStrategy } from './recommendation-strategies/personalized-for-you.strategy';
import { RecommendationCandidates } from './recommendation-candidates';
import { RecommendationRanking } from './recommendation-ranking';
import { RecommendationExplanations } from './recommendation-explanations';

/**
 * Pure, deterministic Recommendation Engine.
 * Executes the complete pipeline:
 * Context -> Strategy Selection -> Candidate Generation -> Filtering -> Deduplication -> Ranking -> Explanation -> Result Limiting
 */
export class RecommendationEngine {
  private readonly strategies: Map<RecommendationStrategy, IRecommendationStrategy>;

  constructor() {
    this.strategies = new Map<RecommendationStrategy, IRecommendationStrategy>();
    this.registerDefaultStrategies();
  }

  private registerDefaultStrategies(): void {
    const defaultList: IRecommendationStrategy[] = [
      new RecentlyViewedStrategy(),
      new SimilarProductsStrategy(),
      new CategoryBasedStrategy(),
      new PriceBasedStrategy(),
      new WishlistBasedStrategy(),
      new CartBasedStrategy(),
      new FrequentlyBoughtTogetherStrategy(),
      new TrendingStrategy(),
      new PersonalizedForYouStrategy(),
    ];

    for (const strat of defaultList) {
      this.strategies.set(strat.type, strat);
    }
  }

  /**
   * Register or overwrite a strategy implementation.
   */
  public registerStrategy(strategy: IRecommendationStrategy): void {
    this.strategies.set(strategy.type, strategy);
  }

  /**
   * Main entry point to run recommendation pipeline.
   */
  public execute(
    context: RecommendationContext,
    requestedStrategy: RecommendationStrategy,
    allProducts: readonly Product[]
  ): RecommendationResponse {
    const limit = Math.max(1, context.limit ?? 10);
    let activeStrategy = requestedStrategy;

    let strategyImpl = this.strategies.get(activeStrategy);

    // If strategy doesn't exist, fallback to trending
    if (!strategyImpl) {
      activeStrategy = 'trending';
      strategyImpl = this.strategies.get('trending')!;
    }

    // Generate candidates
    let rawCandidates = strategyImpl.generateCandidates(context, allProducts);

    // Cold start check: If 0 candidates returned and strategy is personalized/history based, fallback to trending
    if (
      rawCandidates.length === 0 &&
      activeStrategy !== 'trending'
    ) {
      const trendingImpl = this.strategies.get('trending');
      if (trendingImpl) {
        rawCandidates = trendingImpl.generateCandidates(context, allProducts);
      }
    }

    // Candidate filtering (unavailable, out of stock, current product exclusion)
    const filteredCandidates = RecommendationCandidates.filterCandidates(
      rawCandidates,
      context
    );

    // Deduplication
    const deduplicatedCandidates =
      RecommendationCandidates.deduplicateCandidates(filteredCandidates);

    // Normalization & Deterministic Ranking
    const rankedItems = RecommendationRanking.rankCandidates(
      deduplicatedCandidates
    );

    // Take top N items according to limit
    const sliced = rankedItems.slice(0, limit);

    // Format final RecommendationItems
    const items: RecommendationItem[] = sliced.map((ranked) => {
      const formattedExplanation = RecommendationExplanations.formatExplanation(
        ranked.candidate.explanationReason
      );

      return {
        product: ranked.candidate.product,
        strategy: activeStrategy,
        score: ranked.normalizedScore,
        explanation: formattedExplanation,
        ranking: ranked.rank,
      };
    });

    const header = RecommendationExplanations.getStrategyHeader(activeStrategy);

    return {
      strategy: activeStrategy,
      title: header.title,
      subtitle: header.subtitle,
      items,
      total: items.length,
    };
  }
}

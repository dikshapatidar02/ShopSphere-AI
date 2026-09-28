import type {
  RecommendationContext,
  RecommendationResponse,
  RecommendationStrategy,
} from '@/types';
import type { IRecommendationProvider } from './recommendation.provider';
import { RecommendationEngine } from './recommendation-engine';
import { productService, ProductService } from '../products/product.service';

/**
 * Mock Recommendation Provider.
 * Wraps the pure RecommendationEngine and retrieves candidate product datasets
 * via ProductService. Replaceable with a real ML backend provider later.
 */
export class MockRecommendationProvider implements IRecommendationProvider {
  private readonly engine: RecommendationEngine;

  constructor(private readonly prodService: ProductService = productService) {
    this.engine = new RecommendationEngine();
  }

  public async getRecommendations(
    context: RecommendationContext,
    strategy: RecommendationStrategy
  ): Promise<RecommendationResponse> {
    try {
      // Retrieve product pool from ProductService
      const res = await this.prodService.getProducts({ limit: 100 });
      const allProducts = res.success && res.data ? res.data.products : [];

      // Execute deterministic recommendation pipeline
      return this.engine.execute(context, strategy, allProducts);
    } catch {
      // Graceful error fallback: return empty response instead of crashing
      return {
        strategy,
        title: 'Recommended Products',
        subtitle: 'Unable to load personalized recommendations at this time',
        items: [],
        total: 0,
      };
    }
  }
}

import { productService, ProductService } from '../products/product.service';
import { recommendationService, RecommendationService } from '../recommendations/recommendation.service';
import type { Product } from '@/types';
import type { AssistantActiveContext, StructuredAIIntent } from '@/types/assistant';

export class AssistantSearchService {
  constructor(
    private readonly prodService: ProductService = productService,
    private readonly recService: RecommendationService = recommendationService
  ) {}

  public async fetchProductsForIntent(
    intent: StructuredAIIntent,
    activeContext: AssistantActiveContext
  ): Promise<readonly Product[]> {
    if (intent.type === 'recommendation_request') {
      const recRes = await this.recService.getPersonalizedForYou(undefined, 6);
      return recRes.items.map((i) => i.product);
    }

    const category = activeContext.category || intent.entities.category;
    const q = intent.entities.keywords?.join(' ') || '';

    const discoveryRes = await this.prodService.discoverProducts({
      category: category && category !== 'all' ? category : undefined,
      q: q.length > 0 ? q : undefined,
      minPrice: activeContext.minPrice ?? intent.entities.minPrice,
      maxPrice: activeContext.maxPrice ?? intent.entities.maxPrice,
      minRating: activeContext.minRating ?? intent.entities.minRating,
      brand: activeContext.brand ?? intent.entities.brand,
      sort: activeContext.sortBy ?? intent.entities.sortBy ?? 'relevance',
      page: activeContext.page ?? 1,
      limit: 6,
    });

    if (discoveryRes.success && discoveryRes.data) {
      let results = discoveryRes.data.products;

      // Color attribute filtering if extracted
      const targetColor = activeContext.color || intent.entities.color;
      if (targetColor) {
        results = results.filter(
          (p) =>
            p.title.toLowerCase().includes(targetColor.toLowerCase()) ||
            p.description.toLowerCase().includes(targetColor.toLowerCase())
        );
      }

      return results;
    }

    return [];
  }
}

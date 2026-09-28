import type {
  AIIntentType,
  ExtractedEntities,
  StructuredAIIntent,
} from '@/types/assistant';
import { EntityExtractor } from './entity-extractor';
import { QueryNormalizer } from './query-normalizer';

/**
 * Intent Parser for AI Assistant.
 * Maps normalized input text & extracted entities to a high-confidence StructuredAIIntent.
 */
export class IntentParser {
  public static parse(rawQuery: string, hasActiveContext = false): StructuredAIIntent {
    const normalized = QueryNormalizer.normalize(rawQuery);
    const entities = EntityExtractor.extract(normalized);

    const intentType = this.classifyIntent(normalized, entities, hasActiveContext);
    const confidence = intentType === 'unknown' ? 0.2 : 0.95;

    return {
      type: intentType,
      confidence,
      entities,
      rawQuery,
    };
  }

  private static classifyIntent(
    text: string,
    entities: ExtractedEntities,
    hasActiveContext: boolean
  ): AIIntentType {
    // 1. Actions on active result set
    if (/\b(add to cart|add the|buy|add cart|cart item)\b/i.test(text) && /\b(cart|buy)\b/i.test(text)) {
      return 'add_to_cart';
    }

    if (/\b(add to wishlist|save the|save item|wishlist)\b/i.test(text) && /\b(wishlist|save)\b/i.test(text)) {
      return 'add_to_wishlist';
    }

    if (/\b(compare|versus|vs)\b/i.test(text) || entities.comparisonIndexes !== undefined) {
      return 'comparison';
    }

    if (/\b(tell me|details|info|about|specs|specifications)\b/i.test(text) && entities.productReference !== undefined) {
      return 'product_details';
    }

    // 2. Navigation & Utility intents
    if (/\b(show more|next|more results|more products|load more)\b/i.test(text)) {
      return 'show_more';
    }

    if (/\b(clear filters|remove filter|reset filters|remove price filter)\b/i.test(text)) {
      return 'clear_filters';
    }

    if (/\b(reset|clear chat|start over|restart|new chat)\b/i.test(text)) {
      return 'reset_conversation';
    }

    if (/\b(help|commands|options|what can you do|how to use)\b/i.test(text)) {
      return 'help';
    }

    // 3. Recommendation requests
    if (
      /\b(recommend|recommendation|for me|suggest|suggestion|personalized|what should i buy|similar to)\b/i.test(text)
    ) {
      return 'recommendation_request';
    }

    // 4. Sorting intent
    if (entities.sortBy !== undefined) {
      return 'sort_results';
    }

    // 5. Conversational Refinements (when active context exists)
    if (
      hasActiveContext &&
      (/\b(cheaper|lower price|better ratings|ratings|only|instead)\b/i.test(text) ||
        (entities.maxPrice !== undefined && !entities.category) ||
        (entities.minRating !== undefined && !entities.category) ||
        (entities.brand !== undefined && !entities.category) ||
        (entities.color !== undefined && !entities.category))
    ) {
      return 'refine_results';
    }

    // 6. Category Browse or Search
    if (entities.category && !entities.maxPrice && !entities.minPrice && !entities.brand) {
      return 'category_browse';
    }

    if (
      entities.category ||
      entities.maxPrice ||
      entities.minPrice ||
      entities.brand ||
      entities.color ||
      /\b(search|find|show|look for|buy)\b/i.test(text)
    ) {
      return 'product_search';
    }

    return 'unknown';
  }
}

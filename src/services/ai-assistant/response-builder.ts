import type { Product } from '@/types';
import type {
  AssistantActionType,
  AssistantActiveContext,
  AssistantResponsePayload,
  StructuredAIIntent,
} from '@/types/assistant';

export class ResponseBuilder {
  public static buildResponse(
    intent: StructuredAIIntent,
    products: readonly Product[],
    activeContext: AssistantActiveContext,
    actionExecuted: AssistantActionType = 'none',
    actionTargetProduct?: Product,
    comparisonProducts?: readonly Product[]
  ): AssistantResponsePayload {
    const total = products.length;

    // 1. Action-specific responses (Add to Cart / Add to Wishlist / Details / Compare)
    if (actionExecuted === 'cart_add' && actionTargetProduct) {
      return {
        text: `Added **${actionTargetProduct.title}** ($${actionTargetProduct.discountedPrice.toFixed(2)}) to your shopping cart!`,
        intent,
        actionExecuted: 'cart_add',
        actionTargetProduct,
        suggestedProducts: products,
        suggestedPrompts: ['View Cart', 'Show more like this', 'Compare top 2'],
      };
    }

    if (actionExecuted === 'wishlist_add' && actionTargetProduct) {
      return {
        text: `Saved **${actionTargetProduct.title}** to your wishlist!`,
        intent,
        actionExecuted: 'wishlist_add',
        actionTargetProduct,
        suggestedProducts: products,
        suggestedPrompts: ['View Wishlist', 'Something cheaper'],
      };
    }

    if (actionExecuted === 'compare' && comparisonProducts && comparisonProducts.length >= 2) {
      const p1 = comparisonProducts[0];
      const p2 = comparisonProducts[1];
      return {
        text: `Comparing **${p1.title}** ($${p1.discountedPrice.toFixed(2)}, ${p1.rating}★) vs **${p2.title}** ($${p2.discountedPrice.toFixed(2)}, ${p2.rating}★):`,
        intent,
        actionExecuted: 'compare',
        comparisonProducts,
        suggestedProducts: comparisonProducts,
        suggestedPrompts: [`Add ${p1.title} to cart`, `Add ${p2.title} to cart`, 'Show more'],
      };
    }

    // 2. Help Intent
    if (intent.type === 'help') {
      return {
        text: `I can help you discover, compare, and filter products across the catalog!\n\nTry asking me:\n- *"Show me smartphones under $500 with good ratings"*\n- *"Something cheaper"*\n- *"Only Samsung"*\n- *"Compare the first two"*\n- *"Add the 1st item to cart"*`,
        intent,
        suggestedPrompts: ['Smartphones under $500', 'Top rated headphones', 'Trending products'],
      };
    }

    // 3. Clear filters / Reset conversation
    if (intent.type === 'clear_filters' || intent.type === 'reset_conversation') {
      return {
        text: intent.type === 'clear_filters' ? 'Cleared all search filters!' : 'Reset conversation history.',
        intent,
        suggestedProducts: [],
        suggestedPrompts: ['Show smartphones', 'Top rated laptops', 'Popular headphones'],
      };
    }

    // 4. Recommendation request
    if (intent.type === 'recommendation_request') {
      return {
        text: `Here are handpicked personalized recommendations based on your shopping preferences:`,
        intent,
        suggestedProducts: products,
        suggestedPrompts: ['Something cheaper', 'Best rated', 'Show smartphones'],
      };
    }

    // 5. Product Search / Refinement / Category Browse
    if (total === 0) {
      return {
        text: `I couldn't find any products matching your specific filter criteria. Try expanding your search or clearing filters.`,
        intent,
        fallbackReason: 'NO_MATCHING_PRODUCTS',
        suggestedProducts: [],
        suggestedPrompts: ['Clear filters', 'Show all smartphones', 'Trending products'],
      };
    }

    // Format active constraints summary
    const summaryParts: string[] = [];
    if (activeContext.category) summaryParts.push(activeContext.category);
    if (activeContext.maxPrice) summaryParts.push(`under $${activeContext.maxPrice}`);
    if (activeContext.minRating) summaryParts.push(`${activeContext.minRating}★+ rating`);
    if (activeContext.brand) summaryParts.push(`by ${activeContext.brand}`);
    if (activeContext.color) summaryParts.push(`in ${activeContext.color}`);

    const summaryText = summaryParts.length > 0 ? ` for **${summaryParts.join(' ')}**` : '';
    const text = `I found ${total} product${total > 1 ? 's' : ''}${summaryText}:`;

    // Dynamic refinement suggestions
    const suggestions: string[] = [];
    if (!activeContext.maxPrice) suggestions.push('Something cheaper');
    if (!activeContext.minRating) suggestions.push('Better ratings');
    suggestions.push('Compare top 2');
    suggestions.push('Show more');

    return {
      text,
      intent,
      suggestedProducts: products,
      suggestedPrompts: suggestions,
    };
  }
}

import type {
  AssistantActionType,
  AssistantActiveContext,
  ChatMessage,
  ConversationContext,
  IAssistantProvider,
} from '@/types/assistant';
import type { Product } from '@/types';
import { IntentParser } from './intent-parser';
import { EntityExtractor } from './entity-extractor';
import { RefinementHandler } from './refinement-handler';
import { AssistantSearchService } from './assistant-search';
import { ResponseBuilder } from './response-builder';
import { ConversationStateService } from './conversation-state';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';

export class MockAssistantProvider implements IAssistantProvider {
  private readonly searchService: AssistantSearchService;

  constructor(searchService?: AssistantSearchService) {
    this.searchService = searchService || new AssistantSearchService();
  }

  public async sendMessage(
    userMessage: string,
    context: ConversationContext
  ): Promise<{ responseMessage: ChatMessage; updatedContext: ConversationContext }> {
    const hasActiveContext = Boolean(context.activeContext?.currentResults?.length);

    // 1. Parse intent & extract entities
    const intent = IntentParser.parse(userMessage, hasActiveContext);
    const entities = EntityExtractor.extract(userMessage);

    let activeContext: AssistantActiveContext = context.activeContext ?? {};
    let actionExecuted: AssistantActionType = 'none';
    let actionTargetProduct: Product | undefined;
    let comparisonProducts: readonly Product[] | undefined;

    // 2. Process Intent & Context Refinement
    if (intent.type === 'clear_filters' || intent.type === 'reset_conversation') {
      activeContext = {};
    } else if (intent.type === 'refine_results' || intent.type === 'product_search' || intent.type === 'category_browse' || intent.type === 'sort_results') {
      activeContext = RefinementHandler.refine(activeContext, entities, userMessage);
    }

    // 3. Product Reference / Action Resolution
    const currentList = activeContext.currentResults || [];

    if (intent.type === 'add_to_cart') {
      const idx = entities.productReference ?? 0;
      if (currentList[idx]) {
        actionTargetProduct = currentList[idx];
        actionExecuted = 'cart_add';
        try {
          useCartStore.getState().addItem(actionTargetProduct, 1);
        } catch {
          // Fallback safe action
        }
      }
    } else if (intent.type === 'add_to_wishlist') {
      const idx = entities.productReference ?? 0;
      if (currentList[idx]) {
        actionTargetProduct = currentList[idx];
        actionExecuted = 'wishlist_add';
        try {
          useWishlistStore.getState().toggleItem(actionTargetProduct.id);
        } catch {
          // Fallback safe action
        }
      }
    } else if (intent.type === 'comparison') {
      const [idx1, idx2] = entities.comparisonIndexes ?? [0, 1];
      if (currentList[idx1] && currentList[idx2]) {
        comparisonProducts = [currentList[idx1], currentList[idx2]];
        actionExecuted = 'compare';
      }
    }

    // 4. Fetch products if required
    let fetchedProducts: readonly Product[] = currentList;

    if (
      intent.type === 'product_search' ||
      intent.type === 'category_browse' ||
      intent.type === 'refine_results' ||
      intent.type === 'recommendation_request' ||
      intent.type === 'sort_results' ||
      currentList.length === 0
    ) {
      fetchedProducts = await this.searchService.fetchProductsForIntent(intent, activeContext);
    }

    // Update active context results
    const nextActiveContext: AssistantActiveContext = {
      ...activeContext,
      currentResults: fetchedProducts,
    };

    // 5. Build structured payload
    const payload = ResponseBuilder.buildResponse(
      intent,
      fetchedProducts,
      nextActiveContext,
      actionExecuted,
      actionTargetProduct,
      comparisonProducts
    );

    const userChatMessage: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    const assistantChatMessage: ChatMessage = {
      id: `msg_a_${Date.now() + 1}`,
      sender: 'assistant',
      content: payload.text,
      timestamp: new Date().toISOString(),
      payload,
    };

    const updatedMessages = [...context.messages, userChatMessage, assistantChatMessage];

    const updatedContext: ConversationContext = {
      ...context,
      messages: updatedMessages,
      currentActiveIntent: intent,
      activeContext: nextActiveContext,
    };

    ConversationStateService.saveContext(updatedContext);

    return {
      responseMessage: assistantChatMessage,
      updatedContext,
    };
  }

  public resetSession(sessionId: string, userId?: string): ConversationContext {
    return ConversationStateService.createNewSession(sessionId, userId);
  }
}

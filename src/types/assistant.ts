import type { Product } from './product';

export type MessageSender = 'user' | 'assistant' | 'system';

export type AIIntentType =
  | 'product_search'
  | 'recommendation_request'
  | 'price_inquiry'
  | 'category_browse'
  | 'comparison'
  | 'policy_faq'
  | 'refine_results'
  | 'change_category'
  | 'change_price'
  | 'change_rating'
  | 'filter_brand'
  | 'filter_color'
  | 'sort_results'
  | 'show_more'
  | 'product_details'
  | 'add_to_cart'
  | 'add_to_wishlist'
  | 'clear_filters'
  | 'reset_conversation'
  | 'help'
  | 'unknown';

export interface ExtractedEntities {
  readonly category?: string;
  readonly productType?: string;
  readonly brand?: string;
  readonly color?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly minRating?: number;
  readonly sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'relevance';
  readonly productReference?: number; // 0-indexed reference ("first one" => 0)
  readonly comparisonIndexes?: readonly [number, number];
  readonly keywords?: readonly string[];
  readonly attributes?: Record<string, string>;
}

export interface StructuredAIIntent {
  readonly type: AIIntentType;
  readonly confidence: number;
  readonly entities: ExtractedEntities;
  readonly rawQuery: string;
}

export type AssistantActionType =
  | 'cart_add'
  | 'wishlist_add'
  | 'navigate_pdp'
  | 'compare'
  | 'reset_conversation'
  | 'none';

export interface AssistantResponsePayload {
  readonly text: string;
  readonly intent: StructuredAIIntent;
  readonly suggestedProducts?: readonly Product[];
  readonly suggestedCategories?: readonly string[];
  readonly suggestedPrompts?: readonly string[];
  readonly actionExecuted?: AssistantActionType;
  readonly actionTargetProduct?: Product;
  readonly comparisonProducts?: readonly Product[];
  readonly fallbackReason?: string;
}

export interface ChatMessage {
  readonly id: string;
  readonly sender: MessageSender;
  readonly content: string;
  readonly timestamp: string;
  readonly payload?: AssistantResponsePayload;
}

export interface AssistantActiveContext {
  readonly category?: string;
  readonly brand?: string;
  readonly color?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly minRating?: number;
  readonly sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'relevance';
  readonly currentResults?: readonly Product[];
  readonly page?: number;
}

export interface ConversationContext {
  readonly messages: readonly ChatMessage[];
  readonly currentActiveIntent?: StructuredAIIntent;
  readonly activeContext?: AssistantActiveContext;
  readonly userId?: string;
  readonly sessionId: string;
}

export interface IAssistantProvider {
  sendMessage(
    userMessage: string,
    context: ConversationContext
  ): Promise<{ responseMessage: ChatMessage; updatedContext: ConversationContext }>;

  resetSession(sessionId: string, userId?: string): ConversationContext;
}

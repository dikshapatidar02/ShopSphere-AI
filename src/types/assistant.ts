import type { Product } from './product';

export type MessageSender = 'user' | 'assistant' | 'system';

export type AIIntentType =
  | 'product_search'
  | 'recommendation_request'
  | 'price_inquiry'
  | 'category_browse'
  | 'comparison'
  | 'policy_faq'
  | 'unknown';

export interface ExtractedEntities {
  readonly category?: string;
  readonly productType?: string;
  readonly brand?: string;
  readonly color?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly minRating?: number;
  readonly keywords?: readonly string[];
  readonly attributes?: Record<string, string>;
}

export interface StructuredAIIntent {
  readonly type: AIIntentType;
  readonly confidence: number;
  readonly entities: ExtractedEntities;
  readonly rawQuery: string;
}

export interface AssistantResponsePayload {
  readonly text: string;
  readonly intent: StructuredAIIntent;
  readonly suggestedProducts?: readonly Product[];
  readonly suggestedCategories?: readonly string[];
  readonly suggestedPrompts?: readonly string[];
  readonly fallbackReason?: string;
}

export interface ChatMessage {
  readonly id: string;
  readonly sender: MessageSender;
  readonly content: string;
  readonly timestamp: string;
  readonly payload?: AssistantResponsePayload;
}

export interface ConversationContext {
  readonly messages: readonly ChatMessage[];
  readonly currentActiveIntent?: StructuredAIIntent;
  readonly userId?: string;
  readonly sessionId: string;
}

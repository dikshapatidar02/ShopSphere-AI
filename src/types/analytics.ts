import type { RecommendationStrategy } from './recommendation';

export type RecommendationEventType =
  | 'impression'
  | 'click'
  | 'cart_add'
  | 'purchase';

export interface RecommendationAnalyticsEvent {
  readonly id: string;
  readonly strategy: RecommendationStrategy;
  readonly productId: string;
  readonly eventType: RecommendationEventType;
  readonly timestamp: string;
  readonly userId?: string;
}

export interface StrategyPerformanceMetrics {
  readonly strategy: RecommendationStrategy;
  readonly impressions: number;
  readonly clicks: number;
  readonly conversions: number;
  readonly clickThroughRate: number;
  readonly conversionRate: number;
  readonly simulatedRevenue: number;
}

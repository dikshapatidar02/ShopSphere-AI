import type {
  RecommendationAnalyticsEvent,
  RecommendationEventType,
  RecommendationStrategy,
  StrategyPerformanceMetrics,
} from '@/types';

const STORAGE_KEY = 'shopsphere_recommendation_analytics_events';
const MAX_EVENTS = 500;

/**
 * Frontend Analytics Instrumentation Service for Recommendations.
 * Tracks impressions, clicks, cart adds, and purchases per recommendation strategy.
 */
export class RecommendationAnalyticsService {
  private static instance: RecommendationAnalyticsService;

  private constructor() {}

  public static getInstance(): RecommendationAnalyticsService {
    if (!RecommendationAnalyticsService.instance) {
      RecommendationAnalyticsService.instance = new RecommendationAnalyticsService();
    }
    return RecommendationAnalyticsService.instance;
  }

  /**
   * Track a recommendation event.
   */
  public trackEvent(
    strategy: RecommendationStrategy,
    productId: string,
    eventType: RecommendationEventType,
    userId?: string
  ): void {
    if (typeof window === 'undefined') return;

    try {
      const existing = this.getEvents();
      const newEvent: RecommendationAnalyticsEvent = {
        id: `rec_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        strategy,
        productId,
        eventType,
        timestamp: new Date().toISOString(),
        userId,
      };

      const updated = [newEvent, ...existing].slice(0, MAX_EVENTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  /**
   * Retrieve all recorded events.
   */
  public getEvents(): readonly RecommendationAnalyticsEvent[] {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as RecommendationAnalyticsEvent[];
    } catch {
      return [];
    }
  }

  /**
   * Aggregate metrics by strategy for future admin dashboard / analysis.
   */
  public getMetricsByStrategy(): Record<
    RecommendationStrategy,
    StrategyPerformanceMetrics
  > {
    const events = this.getEvents();
    const metrics: Partial<
      Record<RecommendationStrategy, { impressions: number; clicks: number; conversions: number }>
    > = {};

    for (const evt of events) {
      if (!metrics[evt.strategy]) {
        metrics[evt.strategy] = { impressions: 0, clicks: 0, conversions: 0 };
      }
      const entry = metrics[evt.strategy]!;

      if (evt.eventType === 'impression') entry.impressions++;
      else if (evt.eventType === 'click') entry.clicks++;
      else if (evt.eventType === 'cart_add' || evt.eventType === 'purchase')
        entry.conversions++;
    }

    const strategies: RecommendationStrategy[] = [
      'recently_viewed',
      'similar_products',
      'category_based',
      'price_based',
      'wishlist_based',
      'cart_based',
      'frequently_bought_together',
      'trending',
      'personalized_for_you',
    ];

    const result = {} as Record<RecommendationStrategy, StrategyPerformanceMetrics>;

    for (const strat of strategies) {
      const m = metrics[strat] ?? { impressions: 0, clicks: 0, conversions: 0 };
      const ctr = m.impressions > 0 ? m.clicks / m.impressions : 0;
      const convRate = m.clicks > 0 ? m.conversions / m.clicks : 0;

      result[strat] = {
        strategy: strat,
        impressions: m.impressions,
        clicks: m.clicks,
        conversions: m.conversions,
        clickThroughRate: Number(ctr.toFixed(4)),
        conversionRate: Number(convRate.toFixed(4)),
        simulatedRevenue: m.conversions * 49.99, // Simulated estimated value per conversion
      };
    }

    return result;
  }
}

export const recommendationAnalytics = RecommendationAnalyticsService.getInstance();

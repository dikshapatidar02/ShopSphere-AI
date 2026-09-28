import type { RecommendationAnalyticsEvent, RecommendationStrategy, StrategyPerformanceMetrics } from '@/types';
import { recommendationAnalytics } from '@/services/recommendations';

export interface AdminOverviewMetrics {
  readonly totalProducts: number;
  readonly totalOrders: number;
  readonly totalCustomers: number;
  readonly simulatedRevenue: number;
  readonly simulatedConversionRate: number; // e.g. 0.034 (3.4%)
  readonly topProducts: readonly {
    readonly id: string;
    readonly title: string;
    readonly category: string;
    readonly price: number;
    readonly unitsSold: number;
    readonly simulatedRevenue: number;
    readonly stock: number;
  }[];
  readonly lowStockProducts: readonly {
    readonly id: string;
    readonly title: string;
    readonly category: string;
    readonly stock: number;
    readonly availability: string;
  }[];
  readonly recommendationAnalyticsSummary: {
    readonly totalImpressions: number;
    readonly totalClicks: number;
    readonly totalConversions: number;
    readonly averageCTR: number;
    readonly totalSimulatedRevenue: number;
  };
}

export class AdminAnalyticsService {
  private static instance: AdminAnalyticsService;

  private constructor() {}

  public static getInstance(): AdminAnalyticsService {
    if (!AdminAnalyticsService.instance) {
      AdminAnalyticsService.instance = new AdminAnalyticsService();
    }
    return AdminAnalyticsService.instance;
  }

  /**
   * Fast one-pass seed for baseline analytics metrics if none exist
   */
  public seedInitialAnalyticsIfNeeded(): void {
    if (typeof window === 'undefined') return;
    const events = recommendationAnalytics.getEvents();
    if (events.length > 0) return;

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

    const baselineCounts: Record<RecommendationStrategy, { imp: number; clk: number; conv: number }> = {
      recently_viewed: { imp: 145, clk: 21, conv: 4 },
      similar_products: { imp: 120, clk: 18, conv: 3 },
      category_based: { imp: 98, clk: 11, conv: 2 },
      price_based: { imp: 75, clk: 9, conv: 1 },
      wishlist_based: { imp: 112, clk: 19, conv: 3 },
      cart_based: { imp: 134, clk: 24, conv: 4 },
      frequently_bought_together: { imp: 160, clk: 29, conv: 5 },
      trending: { imp: 210, clk: 31, conv: 5 },
      personalized_for_you: { imp: 245, clk: 42, conv: 7 },
    };

    const newEvents: RecommendationAnalyticsEvent[] = [];
    const nowIso = new Date().toISOString();

    for (const strat of strategies) {
      const counts = baselineCounts[strat];
      for (let i = 0; i < counts.imp; i++) {
        newEvents.push({
          id: `seed_imp_${strat}_${i}`,
          strategy: strat,
          productId: `prod-${(i % 10) + 1}`,
          eventType: 'impression',
          timestamp: nowIso,
        });
      }
      for (let i = 0; i < counts.clk; i++) {
        newEvents.push({
          id: `seed_clk_${strat}_${i}`,
          strategy: strat,
          productId: `prod-${(i % 10) + 1}`,
          eventType: 'click',
          timestamp: nowIso,
        });
      }
      for (let i = 0; i < counts.conv; i++) {
        newEvents.push({
          id: `seed_conv_${strat}_${i}`,
          strategy: strat,
          productId: `prod-${(i % 10) + 1}`,
          eventType: 'purchase',
          timestamp: nowIso,
        });
      }
    }

    try {
      localStorage.setItem(
        'shopsphere_recommendation_analytics_events',
        JSON.stringify(newEvents.slice(0, 500))
      );
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Compute performance metrics across all 9 strategies with zero-denominator safety.
   */
  public getStrategyPerformanceMetrics(): Record<RecommendationStrategy, StrategyPerformanceMetrics> {
    this.seedInitialAnalyticsIfNeeded();
    const rawMetrics = recommendationAnalytics.getMetricsByStrategy();

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
      const m = rawMetrics[strat] || {
        strategy: strat,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        simulatedRevenue: 0,
      };

      const imp = Math.max(0, m.impressions);
      const clk = Math.max(0, m.clicks);
      const conv = Math.max(0, m.conversions);

      const ctr = imp > 0 ? clk / imp : 0;
      const convRate = clk > 0 ? conv / clk : 0;
      const revenue = m.simulatedRevenue > 0 ? m.simulatedRevenue : conv * 49.99;

      result[strat] = {
        strategy: strat,
        impressions: imp,
        clicks: clk,
        conversions: conv,
        clickThroughRate: isNaN(ctr) || !isFinite(ctr) ? 0 : Number(ctr.toFixed(4)),
        conversionRate: isNaN(convRate) || !isFinite(convRate) ? 0 : Number(convRate.toFixed(4)),
        simulatedRevenue: isNaN(revenue) || !isFinite(revenue) ? 0 : Number(revenue.toFixed(2)),
      };
    }

    return result;
  }
}

export const adminAnalyticsService = AdminAnalyticsService.getInstance();

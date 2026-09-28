import { describe, expect, it } from 'vitest';
import { adminAnalyticsService } from '../services/admin-analytics.service';
import type { RecommendationStrategy } from '@/types';

describe('AdminAnalyticsService & Strategy Performance', () => {
  it('computes metrics for all 9 recommendation strategies with zero-denominator safety', () => {
    const metricsMap = adminAnalyticsService.getStrategyPerformanceMetrics();
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

    expect(Object.keys(metricsMap).length).toBe(9);

    for (const strat of strategies) {
      const m = metricsMap[strat];
      expect(m).toBeDefined();
      expect(m.strategy).toBe(strat);
      expect(m.impressions).toBeGreaterThanOrEqual(0);
      expect(m.clicks).toBeGreaterThanOrEqual(0);
      expect(m.conversions).toBeGreaterThanOrEqual(0);

      // Verify zero denominator safety
      if (m.impressions === 0) {
        expect(m.clickThroughRate).toBe(0);
      } else {
        expect(isNaN(m.clickThroughRate)).toBe(false);
        expect(isFinite(m.clickThroughRate)).toBe(true);
      }

      if (m.clicks === 0) {
        expect(m.conversionRate).toBe(0);
      } else {
        expect(isNaN(m.conversionRate)).toBe(false);
        expect(isFinite(m.conversionRate)).toBe(true);
      }

      expect(isNaN(m.simulatedRevenue)).toBe(false);
    }
  });
});

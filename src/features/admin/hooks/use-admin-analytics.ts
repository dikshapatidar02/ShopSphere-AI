'use client';

import { useQuery } from '@tanstack/react-query';
import { adminAnalyticsService } from '../services/admin-analytics.service';
import type { RecommendationStrategy, StrategyPerformanceMetrics } from '@/types';

export function useAdminAnalytics() {
  const analyticsQuery = useQuery({
    queryKey: ['admin', 'analytics', 'recommendations'],
    queryFn: async () => {
      return adminAnalyticsService.getStrategyPerformanceMetrics();
    },
    staleTime: 1000 * 15,
  });

  const rawMetrics = analyticsQuery.data || ({} as Record<RecommendationStrategy, StrategyPerformanceMetrics>);
  const strategyList = Object.values(rawMetrics);

  const totals = strategyList.reduce(
    (
      acc: { impressions: number; clicks: number; conversions: number; revenue: number },
      item: StrategyPerformanceMetrics
    ) => {
      acc.impressions += item.impressions || 0;
      acc.clicks += item.clicks || 0;
      acc.conversions += item.conversions || 0;
      acc.revenue += item.simulatedRevenue || 0;
      return acc;
    },
    { impressions: 0, clicks: 0, conversions: 0, revenue: 0 }
  );

  const averageCTR = totals.impressions > 0 ? Number((totals.clicks / totals.impressions).toFixed(4)) : 0;
  const averageConversionRate = totals.clicks > 0 ? Number((totals.conversions / totals.clicks).toFixed(4)) : 0;

  return {
    strategyMetrics: rawMetrics,
    strategyList,
    totals: {
      ...totals,
      averageCTR,
      averageConversionRate,
    },
    isLoading: analyticsQuery.isLoading,
    isError: analyticsQuery.isError,
    refetch: analyticsQuery.refetch,
  };
}

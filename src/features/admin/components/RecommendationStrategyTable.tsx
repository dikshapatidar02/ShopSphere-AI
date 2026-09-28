'use client';

import { RecommendationStrategy, StrategyPerformanceMetrics } from '@/types';
import { AdminTable } from './AdminTable';

interface RecommendationStrategyTableProps {
  readonly metrics: Record<RecommendationStrategy, StrategyPerformanceMetrics>;
}

export function RecommendationStrategyTable({ metrics }: RecommendationStrategyTableProps) {
  const strategyLabels: Record<RecommendationStrategy, string> = {
    recently_viewed: 'Recently Viewed Products',
    similar_products: 'Similar / Related Products',
    category_based: 'Category-Based Recommendations',
    price_based: 'Price Range Matching',
    wishlist_based: 'Wishlist-Driven Suggestions',
    cart_based: 'Cart-Driven Upsells',
    frequently_bought_together: 'Frequently Bought Together',
    trending: 'Trending / Popular Items',
    personalized_for_you: 'Personalized For You Algorithm',
  };

  const list = Object.values(metrics);

  return (
    <AdminTable>
      <thead className="bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
        <tr>
          <th className="px-4 py-3.5">Recommendation Strategy</th>
          <th className="px-4 py-3.5">Impressions</th>
          <th className="px-4 py-3.5">Clicks</th>
          <th className="px-4 py-3.5">CTR (%)</th>
          <th className="px-4 py-3.5">Conversions</th>
          <th className="px-4 py-3.5">Conv. Rate (%)</th>
          <th className="px-4 py-3.5 text-right">Simulated Revenue</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {list.map((m) => {
          const ctrPercent = (m.clickThroughRate * 100).toFixed(2);
          const convRatePercent = (m.conversionRate * 100).toFixed(2);

          return (
            <tr key={m.strategy} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-xs">
                    {strategyLabels[m.strategy] || m.strategy}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">{m.strategy}</span>
                </div>
              </td>

              <td className="px-4 py-3 text-xs font-semibold text-foreground">
                {m.impressions.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-xs font-semibold text-foreground">
                {m.clicks.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {ctrPercent}%
                </span>
              </td>

              <td className="px-4 py-3 text-xs font-semibold text-foreground">
                {m.conversions.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-xs">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {convRatePercent}%
                </span>
              </td>

              <td className="px-4 py-3 text-right font-bold text-foreground text-xs">
                ${m.simulatedRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
            </tr>
          );
        })}
      </tbody>
    </AdminTable>
  );
}

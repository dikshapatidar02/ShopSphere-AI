'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RecommendationContext, RecommendationStrategy } from '@/types';
import { useRecommendations } from '../hooks/use-recommendations';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationSkeleton } from './RecommendationSkeleton';
import { RecommendationErrorState } from './RecommendationErrorState';
import { recommendationAnalytics } from '@/services/recommendations';

interface RecommendationRailProps {
  readonly strategy: RecommendationStrategy;
  readonly context?: RecommendationContext;
  readonly titleOverride?: string;
  readonly subtitleOverride?: string;
  readonly limit?: number;
  readonly className?: string;
}

function RecommendationRailContent({
  strategy,
  context,
  titleOverride,
  subtitleOverride,
  limit = 8,
  className = '',
}: RecommendationRailProps) {
  const mergedContext: RecommendationContext = {
    ...context,
    limit: context?.limit ?? limit,
  };

  const { data, isLoading, isError, refetch } = useRecommendations({
    strategy,
    context: mergedContext,
  });

  // Track impressions when items successfully load
  useEffect(() => {
    if (data && data.items && data.items.length > 0) {
      for (const item of data.items) {
        recommendationAnalytics.trackEvent(
          item.strategy,
          item.product.id,
          'impression'
        );
      }
    }
  }, [data]);

  if (isLoading) {
    return (
      <section className={`py-6 ${className}`} aria-label="Loading recommendations">
        <RecommendationSkeleton count={limit > 4 ? 4 : limit} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className={`py-6 ${className}`} aria-label="Recommendation error">
        <RecommendationErrorState onRetry={() => refetch()} />
      </section>
    );
  }

  if (!data || !data.items || data.items.length === 0) {
    return null;
  }

  const sectionTitle = titleOverride || data.title;
  const sectionSubtitle = subtitleOverride || data.subtitle;

  return (
    <section
      className={`space-y-4 py-6 ${className}`}
      aria-labelledby={`rec-rail-${strategy}-heading`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-border/40 pb-3">
        <div>
          <h2
            id={`rec-rail-${strategy}-heading`}
            className="text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-sm text-muted-foreground">{sectionSubtitle}</p>
          )}
        </div>
      </div>

      {/* Rail Grid - Responsive Layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.items.map((item, idx) => (
          <RecommendationCard
            key={`rec_${item.strategy}_${item.product.id}_${idx}`}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}

export function RecommendationRail(props: RecommendationRailProps) {
  const [fallbackClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })
  );

  return (
    <QueryClientProvider client={fallbackClient}>
      <RecommendationRailContent {...props} />
    </QueryClientProvider>
  );
}

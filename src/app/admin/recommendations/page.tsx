'use client';

import { RecommendationAnalytics } from '@/features/admin';

export default function AdminRecommendationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Recommendation Analytics & Performance
        </h1>
        <p className="text-xs text-muted-foreground">
          Monitor impressions, clicks, CTR, and conversion metrics across all 9 AI recommendation strategies.
        </p>
      </div>

      <RecommendationAnalytics />
    </div>
  );
}

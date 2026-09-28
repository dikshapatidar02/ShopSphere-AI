'use client';

import { AccountLayout } from '@/features/account';
import { RecommendationRail } from '@/features/recommendations';

export default function AccountRecommendationsPage() {
  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="border-b border-border pb-4">
          <h2 className="text-lg font-bold text-foreground">Recommended For You</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personalized product suggestions curated from your activity, wishlist, and shopping signals.
          </p>
        </div>

        <div className="space-y-8">
          <RecommendationRail strategy="personalized_for_you" limit={8} />
          <RecommendationRail strategy="recently_viewed" limit={4} />
          <RecommendationRail strategy="trending" limit={4} />
        </div>
      </div>
    </AccountLayout>
  );
}

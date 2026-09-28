'use client';

import type { RecommendationItem } from '@/types';
import { RecommendationReason } from './RecommendationReason';
import { ProductCard } from '@/features/products/components/ProductCard';
import { recommendationAnalytics } from '@/services/recommendations';

interface RecommendationCardProps {
  readonly item: RecommendationItem;
  readonly priority?: boolean;
}

export function RecommendationCard({ item, priority = false }: RecommendationCardProps) {
  const handleClick = () => {
    recommendationAnalytics.trackEvent(
      item.strategy,
      item.product.id,
      'click'
    );
  };

  return (
    <div
      className="flex flex-col h-full space-y-2 group/rec"
      onClick={handleClick}
    >
      <RecommendationReason explanation={item.explanation} />
      <div className="flex-1">
        <ProductCard product={item.product} priority={priority} />
      </div>
    </div>
  );
}

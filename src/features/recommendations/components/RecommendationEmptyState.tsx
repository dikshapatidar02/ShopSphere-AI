'use client';

import { Sparkles } from 'lucide-react';

interface RecommendationEmptyStateProps {
  readonly title?: string;
  readonly message?: string;
}

export function RecommendationEmptyState({
  title = 'No recommendations yet',
  message = 'Explore more products to personalize your shopping feed.',
}: RecommendationEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center bg-card/50">
      <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">
        <Sparkles className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  );
}

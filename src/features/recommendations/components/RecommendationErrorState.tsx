'use client';

import { AlertCircle } from 'lucide-react';

interface RecommendationErrorStateProps {
  readonly message?: string;
  readonly onRetry?: () => void;
}

export function RecommendationErrorState({
  message = 'Unable to load recommendations at this time.',
  onRetry,
}: RecommendationErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
      <AlertCircle className="h-6 w-6 text-destructive mb-2" />
      <p className="text-sm font-medium text-foreground">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ProductErrorStateProps {
  readonly message?: string;
  readonly onRetry?: () => void;
}

export function ProductErrorState({
  message = 'An unexpected error occurred while loading products.',
  onRetry,
}: ProductErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center my-6 text-destructive">
      <AlertCircle className="h-10 w-10 text-destructive mb-3" />
      <h3 className="text-base font-semibold">Unable to Load Products</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

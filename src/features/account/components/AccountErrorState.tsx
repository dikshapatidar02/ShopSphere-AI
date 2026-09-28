'use client';

import { AlertCircle } from 'lucide-react';

interface AccountErrorStateProps {
  readonly message?: string;
  readonly onRetry?: () => void;
}

export function AccountErrorState({
  message = 'Failed to load account information.',
  onRetry,
}: AccountErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center my-4">
      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
      <h3 className="text-sm font-bold text-foreground">Something went wrong</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

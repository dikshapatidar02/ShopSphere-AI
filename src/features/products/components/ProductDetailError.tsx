'use client';

import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailErrorProps {
  readonly message?: string;
  readonly onRetry?: () => void;
}

export function ProductDetailError({
  message = 'Failed to load product details.',
  onRetry,
}: ProductDetailErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center my-12 text-destructive">
      <AlertCircle className="h-12 w-12 text-destructive mb-3" />
      <h2 className="text-xl font-bold">Error Loading Product</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-background px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    </div>
  );
}

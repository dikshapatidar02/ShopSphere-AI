'use client';

import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly onReset?: () => void;
  readonly resetLabel?: string;
}

export function EmptyState({
  title = 'No products found',
  description = 'We couldn’t find any products matching your search or active filters.',
  onReset,
  resetLabel = 'Clear all filters',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <PackageSearch className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">{description}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
}

'use client';

export function ProductDetailSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-48 rounded bg-muted" />

      {/* Main Grid: Gallery | Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-muted" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`thumb-skel-${i}`} className="h-16 w-16 rounded-lg bg-muted" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded bg-muted" />
          </div>
          <div className="h-6 w-28 rounded bg-muted" />
          <div className="h-12 w-full rounded bg-muted" />
          <div className="h-6 w-36 rounded bg-muted" />
          <div className="h-12 w-full rounded-xl bg-muted" />
        </div>
      </div>

      {/* Description & Specs Skeleton */}
      <div className="space-y-4 pt-6 border-t border-border">
        <div className="h-6 w-40 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
    </div>
  );
}

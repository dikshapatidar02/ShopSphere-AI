'use client';

interface RecommendationSkeletonProps {
  readonly count?: number;
}

export function RecommendationSkeleton({ count = 4 }: RecommendationSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-muted/60" />
      </div>

      {/* Grid / Rail Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={`rec_skel_${index}`}
            className="flex flex-col space-y-3 rounded-xl border border-border p-3"
          >
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted/80" />
            <div className="aspect-square w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

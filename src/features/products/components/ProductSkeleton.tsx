'use client';

export function ProductSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs animate-pulse">
      <div className="aspect-square w-full bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 rounded-md bg-muted" />
          <div className="h-3 w-16 rounded-md bg-muted" />
        </div>
        <div className="h-4 w-3/4 rounded-md bg-muted" />
        <div className="h-4 w-1/2 rounded-md bg-muted" />
        <div className="pt-2 flex justify-between items-center border-t border-border/40">
          <div className="h-4 w-12 rounded-md bg-muted" />
          <div className="h-5 w-16 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { readonly count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductSkeleton key={`skeleton-${idx}`} />
      ))}
    </div>
  );
}

'use client';

export function AccountLoadingState() {
  return (
    <div className="space-y-4 py-6" aria-label="Loading account data">
      <div className="h-20 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`skel_${i}`} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

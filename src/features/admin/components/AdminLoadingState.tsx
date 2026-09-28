'use client';

export function AdminLoadingState() {
  return (
    <div className="space-y-4 py-6" aria-label="Loading admin dashboard data">
      <div className="h-12 w-1/3 animate-pulse rounded-2xl bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`skel_card_${i}`} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-64 w-full animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}

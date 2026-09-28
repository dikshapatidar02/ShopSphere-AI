'use client';

import { Heart, Trash2 } from 'lucide-react';

interface WishlistHeaderProps {
  readonly count: number;
  readonly onClear: () => void;
}

export function WishlistHeader({ count, onClear }: WishlistHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
          <Heart className="h-7 w-7 text-rose-500 fill-rose-500/20" />
          <span>My Wishlist</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {count === 0
            ? 'No saved items in your wishlist'
            : `You have ${count} saved ${count === 1 ? 'product' : 'products'} in your wishlist.`}
        </p>
      </div>

      {count > 0 && (
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear your wishlist?')) {
              onClear();
            }
          }}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Wishlist</span>
        </button>
      )}
    </div>
  );
}

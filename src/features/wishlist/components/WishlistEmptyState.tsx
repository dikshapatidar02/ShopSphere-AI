'use client';

import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6 max-w-md mx-auto">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 shadow-xs">
        <Heart className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Your Wishlist is Empty
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You haven&apos;t saved any items to your wishlist yet. Click the heart icon on any product to save it for later review!
        </p>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      >
        <span>Discover Products</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

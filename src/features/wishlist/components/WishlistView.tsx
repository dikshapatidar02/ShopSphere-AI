'use client';

import { useWishlistProducts } from '../hooks/use-wishlist-products';
import { WishlistEmptyState } from './WishlistEmptyState';
import { WishlistGrid } from './WishlistGrid';
import { WishlistHeader } from './WishlistHeader';

export function WishlistView() {
  const { products, isLoading, wishlistCount, isEmpty, removeItem, clearWishlist } =
    useWishlistProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <WishlistHeader count={wishlistCount} onClear={clearWishlist} />

      {isLoading && wishlistCount > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: wishlistCount }).map((_, i) => (
            <div
              key={i}
              className="h-80 w-full animate-pulse rounded-xl bg-muted border border-border"
            />
          ))}
        </div>
      ) : isEmpty ? (
        <WishlistEmptyState />
      ) : (
        <WishlistGrid products={products} onRemove={removeItem} />
      )}
    </main>
  );
}

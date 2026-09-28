'use client';

import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useWishlistProducts } from '@/features/wishlist/hooks/use-wishlist-products';
import { Heart } from 'lucide-react';
import { AccountEmptyState } from './AccountEmptyState';

export function AccountWishlist() {
  const { products, isLoading, isError, isEmpty } = useWishlistProducts();

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground">Saved Wishlist</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your saved products and move items to cart anytime.
        </p>
      </div>

      {isEmpty && !isLoading ? (
        <AccountEmptyState
          title="Your Wishlist is Empty"
          description="Explore our catalog and save items to view them here anytime."
          actionLabel="Explore Products"
          actionHref="/products"
          icon={<Heart className="h-6 w-6 text-rose-500" />}
        />
      ) : (
        <ProductGrid products={products} isLoading={isLoading} isError={isError} />
      )}
    </div>
  );
}

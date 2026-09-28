'use client';

import type { Product } from '@/types';
import { WishlistItem } from './WishlistItem';

interface WishlistGridProps {
  readonly products: readonly Product[];
  readonly onRemove: (productId: string) => void;
}

export function WishlistGrid({ products, onRemove }: WishlistGridProps) {
  return (
    <section aria-label="Wishlist Products Grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <WishlistItem key={product.id} product={product} onRemove={onRemove} />
      ))}
    </section>
  );
}

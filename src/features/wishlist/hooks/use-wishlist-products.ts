'use client';

import { useWishlist } from '@/hooks/use-wishlist';
import { productService } from '@/services/products/product.service';
import type { Product } from '@/types';
import { useQueries } from '@tanstack/react-query';

export function useWishlistProducts() {
  const { items, removeItem, clearWishlist, wishlistCount, isEmpty } = useWishlist();

  const productQueries = useQueries({
    queries: items.map((item) => ({
      queryKey: ['product', item.productId],
      queryFn: async () => {
        const res = await productService.getProductById(item.productId);
        if (!res.success) {
          throw new Error(res.error.message || 'Failed to fetch product');
        }
        return res.data;
      },
      staleTime: 1000 * 60 * 5,
    })),
  });

  const isLoading = productQueries.some((q) => q.isLoading);
  const isError = productQueries.some((q) => q.isError);

  const products = productQueries
    .map((q) => q.data)
    .filter((p): p is Product => Boolean(p));

  return {
    items,
    products,
    isLoading,
    isError,
    wishlistCount,
    isEmpty,
    removeItem,
    clearWishlist,
  };
}

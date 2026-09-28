import { productService } from '@/services/products/product.service';
import type { Product } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useProductDetail(productId: string) {
  return useQuery<Product, Error>({
    queryKey: ['products', 'detail', productId],
    queryFn: async ({ signal }) => {
      if (!productId || productId.trim().length === 0) {
        throw new Error('Invalid Product ID');
      }

      const res = await productService.getProductById(productId, signal);
      if (!res.success) {
        throw new Error(res.error.message || 'Product not found');
      }
      return res.data;
    },
    enabled: Boolean(productId && productId.trim().length > 0),
    staleTime: 5 * 60 * 1000,
  });
}

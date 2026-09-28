import { productService } from '@/services/products/product.service';
import type { SearchResult } from '@/types';
import { useQuery } from '@tanstack/react-query';
import type { ProductDiscoveryQuery } from '../types/discovery-query';

export function useProductDiscovery(query: ProductDiscoveryQuery) {
  return useQuery<SearchResult, Error>({
    queryKey: ['products', 'discovery', query],
    queryFn: async ({ signal }) => {
      const res = await productService.discoverProducts(query, signal);
      if (!res.success) {
        throw new Error(res.error.message || 'Failed to fetch products');
      }
      return res.data;
    },
    placeholderData: (previousData) => previousData, // smooth pagination transitions
  });
}

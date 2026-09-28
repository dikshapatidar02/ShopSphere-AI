import { categoryService } from '@/services/categories/category.service';
import type { Category } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useCategoriesQuery() {
  return useQuery<readonly Category[], Error>({
    queryKey: ['categories'],
    queryFn: async ({ signal }) => {
      const res = await categoryService.getCategories(signal);
      if (!res.success) {
        throw new Error(res.error.message || 'Failed to fetch categories');
      }
      return res.data;
    },
    staleTime: 10 * 60 * 1000, // Categories don't change often (10 min stale time)
  });
}

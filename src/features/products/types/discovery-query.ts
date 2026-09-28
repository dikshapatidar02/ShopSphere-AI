import type { SortOption } from '@/types';

export type ProductSortOption = SortOption | 'relevance' | 'name_asc' | 'name_desc';

export type AvailabilityFilterOption = 'all' | 'in_stock' | 'out_of_stock';

export interface ProductDiscoveryQuery {
  readonly q?: string;
  readonly category?: string;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly minRating?: number;
  readonly brand?: string;
  readonly availability?: AvailabilityFilterOption;
  readonly sort?: ProductSortOption;
  readonly page?: number;
  readonly limit?: number;
}

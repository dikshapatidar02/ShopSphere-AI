import type { Product } from './product';

export type SortOption =
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'discount_desc'
  | 'newest'
  | 'relevance';

export interface SearchFilter {
  readonly categories?: readonly string[];
  readonly brands?: readonly string[];
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly minRating?: number;
  readonly inStockOnly?: boolean;
  readonly minDiscount?: number;
}

export interface SearchQuery {
  readonly query: string;
  readonly filters: SearchFilter;
  readonly sort: SortOption;
  readonly page: number;
  readonly limit: number;
}

export interface SearchSuggestion {
  readonly text: string;
  readonly category?: string;
  readonly type: 'keyword' | 'category' | 'brand';
}

export interface CategoryFacet {
  readonly slug: string;
  readonly name: string;
  readonly count: number;
}

export interface BrandFacet {
  readonly name: string;
  readonly count: number;
}

export interface PriceRangeFacet {
  readonly min: number;
  readonly max: number;
}

export interface SearchResultMetadata {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly appliedFilters: SearchFilter;
  readonly availableCategories: readonly CategoryFacet[];
  readonly availableBrands: readonly BrandFacet[];
  readonly priceRange: PriceRangeFacet;
}

export interface SearchResult {
  readonly products: readonly Product[];
  readonly metadata: SearchResultMetadata;
  readonly suggestions?: readonly string[];
}

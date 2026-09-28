import type { AvailabilityFilterOption, ProductDiscoveryQuery, ProductSortOption } from '../types/discovery-query';

export function parseDiscoveryQuery(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): ProductDiscoveryQuery {
  const getParam = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) {
      return params.get(key) || undefined;
    }
    const val = params[key];
    if (Array.isArray(val)) return val[0] || undefined;
    return val || undefined;
  };

  const rawQ = getParam('q');
  const q = rawQ ? rawQ.trim().replace(/\s+/g, ' ') : undefined;

  const category = getParam('category')?.trim() || undefined;

  const rawMinPrice = Number(getParam('minPrice'));
  const minPrice = !isNaN(rawMinPrice) && rawMinPrice >= 0 ? rawMinPrice : undefined;

  const rawMaxPrice = Number(getParam('maxPrice'));
  const maxPrice = !isNaN(rawMaxPrice) && rawMaxPrice >= 0 ? rawMaxPrice : undefined;

  const rawMinRating = Number(getParam('minRating'));
  const minRating = !isNaN(rawMinRating) && rawMinRating >= 1 && rawMinRating <= 5 ? rawMinRating : undefined;

  const brand = getParam('brand')?.trim() || undefined;

  const rawAvailability = getParam('availability')?.trim().toLowerCase();
  const availability: AvailabilityFilterOption =
    rawAvailability === 'in_stock' || rawAvailability === 'out_of_stock' ? rawAvailability : 'all';

  const rawSort = getParam('sort')?.trim().toLowerCase() as ProductSortOption | undefined;
  const validSorts: ProductSortOption[] = [
    'relevance',
    'price_asc',
    'price_desc',
    'rating_desc',
    'name_asc',
    'name_desc',
  ];
  const sort: ProductSortOption = rawSort && validSorts.includes(rawSort) ? rawSort : 'relevance';

  const rawPage = Number(getParam('page'));
  const page = !isNaN(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  const rawLimit = Number(getParam('limit'));
  const limit = !isNaN(rawLimit) && rawLimit >= 1 && rawLimit <= 100 ? Math.floor(rawLimit) : 12;

  return {
    q,
    category,
    minPrice,
    maxPrice,
    minRating,
    brand,
    availability,
    sort,
    page,
    limit,
  };
}

export function serializeDiscoveryQuery(query: ProductDiscoveryQuery): string {
  const searchParams = new URLSearchParams();

  if (query.q && query.q.trim().length > 0) {
    searchParams.set('q', query.q.trim());
  }

  if (query.category && query.category !== 'all' && query.category.trim().length > 0) {
    searchParams.set('category', query.category.trim());
  }

  if (typeof query.minPrice === 'number' && query.minPrice >= 0) {
    searchParams.set('minPrice', String(query.minPrice));
  }

  if (typeof query.maxPrice === 'number' && query.maxPrice >= 0) {
    searchParams.set('maxPrice', String(query.maxPrice));
  }

  if (typeof query.minRating === 'number' && query.minRating >= 1) {
    searchParams.set('minRating', String(query.minRating));
  }

  if (query.brand && query.brand.trim().length > 0) {
    searchParams.set('brand', query.brand.trim());
  }

  if (query.availability && query.availability !== 'all') {
    searchParams.set('availability', query.availability);
  }

  if (query.sort && query.sort !== 'relevance') {
    searchParams.set('sort', query.sort);
  }

  if (typeof query.page === 'number' && query.page > 1) {
    searchParams.set('page', String(query.page));
  }

  return searchParams.toString();
}

export function validatePriceRange(
  minPrice?: number,
  maxPrice?: number
): { minPrice?: number; maxPrice?: number; isValid: boolean; error?: string } {
  if (typeof minPrice === 'number' && typeof maxPrice === 'number' && minPrice > maxPrice) {
    return {
      minPrice,
      maxPrice,
      isValid: false,
      error: 'Minimum price cannot be greater than maximum price',
    };
  }
  return { minPrice, maxPrice, isValid: true };
}

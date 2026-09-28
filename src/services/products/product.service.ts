import type { ProductDiscoveryQuery } from '@/features/products/types/discovery-query';
import type { ApiResponse, Product, SearchResult } from '@/types';
import { apiConfig } from '../api/config';
import { globalCache, SimpleCache } from '../cache/simple-cache';
import { MockProductProvider } from '../mocks/product.mock-provider';
import { DummyJsonProductProvider } from './product.dummyjson-provider';
import type {
  GetProductsParams,
  IProductProvider,
  ProductListResponse,
} from './product.provider';

export class ProductService {
  constructor(
    private provider: IProductProvider,
    private cache: SimpleCache = globalCache
  ) {}

  public async getProducts(
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const cacheKey = `products_list_${params?.limit ?? 30}_${params?.skip ?? 0}_${params?.category ?? ''}_${params?.query ?? ''}`;

    const cached = this.cache.get<ProductListResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const res = await this.provider.getProducts(params);
    if (res.success) {
      this.cache.set(cacheKey, res.data, apiConfig.cacheTtlMs);
      return res;
    }

    const fallback = this.cache.getLastKnown<ProductListResponse>(cacheKey);
    if (fallback) {
      return { success: true, data: fallback };
    }

    return res;
  }

  public async getProductById(
    id: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<Product>> {
    const cacheKey = `product_${id}`;

    const cached = this.cache.get<Product>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const res = await this.provider.getProductById(id, signal);
    if (res.success) {
      this.cache.set(cacheKey, res.data, apiConfig.cacheTtlMs);
      return res;
    }

    const mockRes = await this.mockFallbackProvider.getProductById(id);
    if (mockRes.success) {
      this.cache.set(cacheKey, mockRes.data, apiConfig.cacheTtlMs);
      return mockRes;
    }

    const fallback = this.cache.getLastKnown<Product>(cacheKey);
    if (fallback) {
      return { success: true, data: fallback };
    }

    return res;
  }

  public async searchProducts(
    query: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    if (!query || query.trim().length === 0) {
      return this.getProducts(params);
    }

    const cacheKey = `search_${query.trim()}_${params?.limit ?? 30}_${params?.skip ?? 0}`;

    const cached = this.cache.get<ProductListResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const res = await this.provider.searchProducts(query, params);
    if (res.success) {
      this.cache.set(cacheKey, res.data, apiConfig.cacheTtlMs);
      return res;
    }

    const fallback = this.cache.getLastKnown<ProductListResponse>(cacheKey);
    if (fallback) {
      return { success: true, data: fallback };
    }

    return res;
  }

  public async getProductsByCategory(
    category: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const cacheKey = `category_products_${category}_${params?.limit ?? 30}_${params?.skip ?? 0}`;

    const cached = this.cache.get<ProductListResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const res = await this.provider.getProductsByCategory(category, params);
    if (res.success) {
      this.cache.set(cacheKey, res.data, apiConfig.cacheTtlMs);
      return res;
    }

    const fallback = this.cache.getLastKnown<ProductListResponse>(cacheKey);
    if (fallback) {
      return { success: true, data: fallback };
    }

    return res;
  }

  public async discoverProducts(
    discoveryQuery: ProductDiscoveryQuery,
    signal?: AbortSignal
  ): Promise<ApiResponse<SearchResult>> {
    const q = discoveryQuery.q?.trim() || '';
    const category = discoveryQuery.category?.trim() || '';
    const page = Math.max(1, discoveryQuery.page || 1);
    const limit = Math.min(100, Math.max(1, discoveryQuery.limit || 12));

    const cacheKey = `discovery_${JSON.stringify(discoveryQuery)}`;
    const cached = this.cache.get<SearchResult>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    // Fetch base dataset from provider
    let baseRes: ApiResponse<ProductListResponse>;
    if (q.length > 0) {
      baseRes = await this.provider.searchProducts(q, { limit: 100, skip: 0, signal });
    } else if (category.length > 0 && category !== 'all') {
      baseRes = await this.provider.getProductsByCategory(category, { limit: 100, skip: 0, signal });
    } else {
      baseRes = await this.provider.getProducts({ limit: 100, skip: 0, signal });
    }

    if (!baseRes.success) {
      const fallback = this.cache.getLastKnown<SearchResult>(cacheKey);
      if (fallback) {
        return { success: true, data: fallback };
      }
      return baseRes;
    }

    let items = [...baseRes.data.products];

    // Filter by category if query was search
    if (category && category !== 'all' && q.length > 0) {
      items = items.filter(
        (p) =>
          p.category.toLowerCase() === category.toLowerCase() ||
          p.categoryName?.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by min price
    if (typeof discoveryQuery.minPrice === 'number') {
      items = items.filter((p) => p.discountedPrice >= discoveryQuery.minPrice!);
    }

    // Filter by max price
    if (typeof discoveryQuery.maxPrice === 'number') {
      items = items.filter((p) => p.discountedPrice <= discoveryQuery.maxPrice!);
    }

    // Filter by min rating
    if (typeof discoveryQuery.minRating === 'number') {
      items = items.filter((p) => p.rating >= discoveryQuery.minRating!);
    }

    // Filter by brand
    if (discoveryQuery.brand && discoveryQuery.brand.trim().length > 0) {
      const targetBrand = discoveryQuery.brand.trim().toLowerCase();
      items = items.filter((p) => p.brand.toLowerCase() === targetBrand);
    }

    // Filter by availability
    if (discoveryQuery.availability === 'in_stock') {
      items = items.filter((p) => p.stock > 0 && p.availability !== 'out_of_stock');
    } else if (discoveryQuery.availability === 'out_of_stock') {
      items = items.filter((p) => p.stock === 0 || p.availability === 'out_of_stock');
    }

    // Derive facets
    const brandCounts = new Map<string, number>();
    const categoryCounts = new Map<string, number>();
    let minPriceFound = Infinity;
    let maxPriceFound = 0;

    items.forEach((p) => {
      brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
      categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
      if (p.discountedPrice < minPriceFound) minPriceFound = p.discountedPrice;
      if (p.discountedPrice > maxPriceFound) maxPriceFound = p.discountedPrice;
    });

    // Sort items
    const sort = discoveryQuery.sort || 'relevance';
    if (sort === 'price_asc') {
      items.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sort === 'price_desc') {
      items.sort((a, b) => b.discountedPrice - a.discountedPrice);
    } else if (sort === 'rating_desc') {
      items.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'name_asc') {
      items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'name_desc') {
      items.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Pagination
    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const clampedPage = Math.min(page, totalPages);
    const skip = (clampedPage - 1) * limit;
    const pagedProducts = items.slice(skip, skip + limit);

    const result: SearchResult = {
      products: pagedProducts,
      metadata: {
        total,
        page: clampedPage,
        limit,
        totalPages,
        appliedFilters: {
          categories: category && category !== 'all' ? [category] : [],
          brands: discoveryQuery.brand ? [discoveryQuery.brand] : [],
          minPrice: discoveryQuery.minPrice,
          maxPrice: discoveryQuery.maxPrice,
          minRating: discoveryQuery.minRating,
          inStockOnly: discoveryQuery.availability === 'in_stock',
        },
        availableCategories: Array.from(categoryCounts.entries()).map(([cat, count]) => ({
          slug: cat,
          name: cat
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          count,
        })),
        availableBrands: Array.from(brandCounts.entries()).map(([b, count]) => ({
          name: b,
          count,
        })),
        priceRange: {
          min: minPriceFound === Infinity ? 0 : minPriceFound,
          max: maxPriceFound,
        },
      },
    };

    this.cache.set(cacheKey, result, apiConfig.cacheTtlMs);
    return { success: true, data: result };
  }

  private mockFallbackProvider = new MockProductProvider();

  public clearCache(): void {
    this.cache.clear();
  }

  public async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    this.clearCache();
    if (this.provider.createProduct) {
      return this.provider.createProduct(productData);
    }
    return this.mockFallbackProvider.createProduct(productData);
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    this.clearCache();
    if (this.provider.updateProduct) {
      return this.provider.updateProduct(id, updates);
    }
    return this.mockFallbackProvider.updateProduct(id, updates);
  }

  public async deleteProduct(id: string): Promise<ApiResponse<{ readonly id: string }>> {
    this.clearCache();
    if (this.provider.deleteProduct) {
      return this.provider.deleteProduct(id);
    }
    return this.mockFallbackProvider.deleteProduct(id);
  }

  public async updateInventory(id: string, stock: number): Promise<ApiResponse<Product>> {
    this.clearCache();
    if (this.provider.updateInventory) {
      return this.provider.updateInventory(id, stock);
    }
    return this.mockFallbackProvider.updateInventory(id, stock);
  }
}

/**
 * Default ProductService instance created based on environment provider config.
 */
export function createProductService(
  providerType: 'dummyjson' | 'mock' = apiConfig.defaultProvider
): ProductService {
  const provider =
    providerType === 'mock'
      ? new MockProductProvider()
      : new DummyJsonProductProvider();
  return new ProductService(provider);
}

export const productService = createProductService();

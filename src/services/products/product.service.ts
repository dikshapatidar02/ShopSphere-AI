import type { ApiResponse, Product } from '@/types';
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

    // Fallback to last known cache if provider request failed
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

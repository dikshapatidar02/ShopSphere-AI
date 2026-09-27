import { describe, expect, it, vi } from 'vitest';
import { SimpleCache } from '../cache/simple-cache';
import { MockProductProvider } from '../mocks/product.mock-provider';
import type { IProductProvider, ProductListResponse } from '../products/product.provider';
import { ProductService } from '../products/product.service';

describe('ProductService', () => {
  it('should fetch products using underlying provider and populate cache', async () => {
    const mockProvider = new MockProductProvider();
    const cache = new SimpleCache();
    const service = new ProductService(mockProvider, cache);

    const res = await service.getProducts();
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.length).toBeGreaterThan(0);
    }

    // Verify item is cached
    const cached = cache.get<ProductListResponse>('products_list_30_0__');
    expect(cached).not.toBeNull();
    expect(cached?.products.length).toBe(res.success ? res.data.products.length : 0);
  });

  it('should fallback to last known cache when provider fails', async () => {
    const failingProvider: IProductProvider = {
      getProducts: vi.fn().mockResolvedValue({
        success: false,
        error: { code: 'NETWORK_ERROR', message: 'Network offline', timestamp: '' },
      }),
      getProductById: vi.fn(),
      searchProducts: vi.fn(),
      getProductsByCategory: vi.fn(),
    };

    const cache = new SimpleCache();
    const mockResponse: ProductListResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 30,
    };

    // Pre-populate cache (even with TTL 0 to simulate expired cache)
    cache.set('products_list_30_0__', mockResponse, -1000);

    const service = new ProductService(failingProvider, cache);
    const res = await service.getProducts();

    // Should return success via last-known-good fallback!
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toEqual(mockResponse);
    }
  });
});

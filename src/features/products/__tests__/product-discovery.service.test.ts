import { MockProductProvider } from '@/services/mocks/product.mock-provider';
import { ProductService } from '@/services/products/product.service';
import { describe, expect, it } from 'vitest';

describe('ProductService.discoverProducts', () => {
  const service = new ProductService(new MockProductProvider());

  it('should search products by keyword and return paginated results', async () => {
    const res = await service.discoverProducts({ q: 'UltraBook' });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.length).toBe(1);
      expect(res.data.products[0].title).toContain('UltraBook');
      expect(res.data.metadata.total).toBe(1);
    }
  });

  it('should filter products by price range', async () => {
    const res = await service.discoverProducts({ minPrice: 100, maxPrice: 900 });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.every((p) => p.discountedPrice >= 100 && p.discountedPrice <= 900)).toBe(true);
    }
  });

  it('should filter products by minimum rating', async () => {
    const res = await service.discoverProducts({ minRating: 4.7 });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.every((p) => p.rating >= 4.7)).toBe(true);
    }
  });

  it('should filter products by availability', async () => {
    const res = await service.discoverProducts({ availability: 'out_of_stock' });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.length).toBe(1);
      expect(res.data.products[0].availability).toBe('out_of_stock');
    }
  });

  it('should sort products by price ascending', async () => {
    const res = await service.discoverProducts({ sort: 'price_asc' });
    expect(res.success).toBe(true);
    if (res.success) {
      const prices = res.data.products.map((p) => p.discountedPrice);
      for (let i = 1; i < prices.length; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
      }
    }
  });
});

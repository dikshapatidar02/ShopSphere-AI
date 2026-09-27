import { describe, expect, it } from 'vitest';
import { MockCategoryProvider } from '../mocks/category.mock-provider';
import { MockProductProvider } from '../mocks/product.mock-provider';

describe('Mock Providers', () => {
  const productProvider = new MockProductProvider();
  const categoryProvider = new MockCategoryProvider();

  it('should return mock products list', async () => {
    const res = await productProvider.getProducts();
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.length).toBeGreaterThan(0);
      expect(res.data.total).toBe(res.data.products.length);
    }
  });

  it('should retrieve a mock product by ID', async () => {
    const res = await productProvider.getProductById('prod-1');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.id).toBe('prod-1');
      expect(res.data.brand).toBe('TechPro');
    }
  });

  it('should search products by keyword', async () => {
    const res = await productProvider.searchProducts('UltraBook');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.length).toBe(1);
      expect(res.data.products[0].title).toContain('UltraBook');
    }
  });

  it('should filter products by category', async () => {
    const res = await productProvider.getProductsByCategory('beauty');
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.products.length).toBe(1);
      expect(res.data.products[0].category).toBe('beauty');
    }
  });

  it('should return mock categories list', async () => {
    const res = await categoryProvider.getCategories();
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data[0].slug).toBeDefined();
    }
  });
});

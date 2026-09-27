import type { ApiResponse, Product } from '@/types';
import { createAppError } from '../api/errors';
import type {
  GetProductsParams,
  IProductProvider,
  ProductListResponse,
} from '../products/product.provider';
import { MOCK_PRODUCTS } from './data/products.seed';

export class MockProductProvider implements IProductProvider {
  private products: Product[];

  constructor(seedProducts: readonly Product[] = MOCK_PRODUCTS) {
    this.products = [...seedProducts];
  }

  public async getProducts(
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const limit = params?.limit ?? 30;
    const skip = params?.skip ?? 0;
    const sliced = this.products.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        products: sliced,
        total: this.products.length,
        skip,
        limit,
      },
    };
  }

  public async getProductById(
    id: string
  ): Promise<ApiResponse<Product>> {
    const found = this.products.find(
      (p) => p.id === id || p.id === `prod-${id}` || p.id === id.replace(/^prod-/, '')
    );

    if (!found) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', `Product with ID '${id}' not found in mock store`),
      };
    }

    return {
      success: true,
      data: found,
    };
  }

  public async searchProducts(
    query: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const q = query.trim().toLowerCase();
    const filtered = this.products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    const limit = params?.limit ?? 30;
    const skip = params?.skip ?? 0;
    const sliced = filtered.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        products: sliced,
        total: filtered.length,
        skip,
        limit,
      },
    };
  }

  public async getProductsByCategory(
    category: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const cat = category.trim().toLowerCase();
    const filtered = this.products.filter(
      (p) => p.category.toLowerCase() === cat || p.categoryName?.toLowerCase() === cat
    );

    const limit = params?.limit ?? 30;
    const skip = params?.skip ?? 0;
    const sliced = filtered.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        products: sliced,
        total: filtered.length,
        skip,
        limit,
      },
    };
  }
}

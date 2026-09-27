import type {
  ApiResponse,
  DummyJsonProductDTO,
  DummyJsonProductsResponseDTO,
  Product,
} from '@/types';
import { apiClient, ApiClient } from '../api/client';
import { normalizeProduct, normalizeProducts } from './product.mapper';
import type {
  GetProductsParams,
  IProductProvider,
  ProductListResponse,
} from './product.provider';

export class DummyJsonProductProvider implements IProductProvider {
  constructor(private client: ApiClient = apiClient) {}

  public async getProducts(
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const res = await this.client.get<DummyJsonProductsResponseDTO>('/products', {
      params: {
        limit: params?.limit ?? 30,
        skip: params?.skip ?? 0,
      },
      signal: params?.signal,
    });

    if (!res.success) {
      return res;
    }

    return {
      success: true,
      data: {
        products: normalizeProducts(res.data.products || []),
        total: res.data.total ?? 0,
        skip: res.data.skip ?? 0,
        limit: res.data.limit ?? 30,
      },
    };
  }

  public async getProductById(
    id: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<Product>> {
    const numericId = parseInt(id.replace(/^prod-/, ''), 10);
    const targetEndpoint = isNaN(numericId) ? `/products/${id}` : `/products/${numericId}`;

    const res = await this.client.get<DummyJsonProductDTO>(targetEndpoint, {
      signal,
    });

    if (!res.success) {
      return res;
    }

    return {
      success: true,
      data: normalizeProduct(res.data),
    };
  }

  public async searchProducts(
    query: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const res = await this.client.get<DummyJsonProductsResponseDTO>('/products/search', {
      params: {
        q: query,
        limit: params?.limit ?? 30,
        skip: params?.skip ?? 0,
      },
      signal: params?.signal,
    });

    if (!res.success) {
      return res;
    }

    return {
      success: true,
      data: {
        products: normalizeProducts(res.data.products || []),
        total: res.data.total ?? 0,
        skip: res.data.skip ?? 0,
        limit: res.data.limit ?? 30,
      },
    };
  }

  public async getProductsByCategory(
    category: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    const res = await this.client.get<DummyJsonProductsResponseDTO>(
      `/products/category/${encodeURIComponent(category)}`,
      {
        params: {
          limit: params?.limit ?? 30,
          skip: params?.skip ?? 0,
        },
        signal: params?.signal,
      }
    );

    if (!res.success) {
      return res;
    }

    return {
      success: true,
      data: {
        products: normalizeProducts(res.data.products || []),
        total: res.data.total ?? 0,
        skip: res.data.skip ?? 0,
        limit: res.data.limit ?? 30,
      },
    };
  }
}

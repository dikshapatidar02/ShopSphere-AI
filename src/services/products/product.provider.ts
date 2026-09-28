import type { ApiResponse, Product } from '@/types';

export interface GetProductsParams {
  readonly limit?: number;
  readonly skip?: number;
  readonly category?: string;
  readonly query?: string;
  readonly signal?: AbortSignal;
}

export interface ProductListResponse {
  readonly products: readonly Product[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

export interface IProductProvider {
  getProducts(params?: GetProductsParams): Promise<ApiResponse<ProductListResponse>>;
  getProductById(id: string, signal?: AbortSignal): Promise<ApiResponse<Product>>;
  searchProducts(
    query: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>>;
  getProductsByCategory(
    category: string,
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>>;
  createProduct?(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>>;
  updateProduct?(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>>;
  deleteProduct?(id: string): Promise<ApiResponse<{ readonly id: string }>>;
  updateInventory?(id: string, stock: number): Promise<ApiResponse<Product>>;
}

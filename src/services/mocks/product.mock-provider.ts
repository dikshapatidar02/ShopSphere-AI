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
    this.syncFromStorage();
  }

  private syncFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      const storedAdditions = localStorage.getItem('shopsphere_admin_custom_products');
      if (storedAdditions) {
        const custom: Product[] = JSON.parse(storedAdditions);
        for (const p of custom) {
          const idx = this.products.findIndex((existing) => existing.id === p.id);
          if (idx >= 0) {
            this.products[idx] = p;
          } else {
            this.products.unshift(p);
          }
        }
      }

      const storedDeletions = localStorage.getItem('shopsphere_admin_deleted_product_ids');
      if (storedDeletions) {
        const deletedIds: string[] = JSON.parse(storedDeletions);
        this.products = this.products.filter((p) => !deletedIds.includes(p.id));
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('shopsphere_admin_custom_products', JSON.stringify(this.products));
    } catch {
      // Ignore storage errors
    }
  }

  public async getProducts(
    params?: GetProductsParams
  ): Promise<ApiResponse<ProductListResponse>> {
    this.syncFromStorage();
    const limit = params?.limit ?? 100;
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
    this.syncFromStorage();
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
    this.syncFromStorage();
    const q = query.trim().toLowerCase();
    const filtered = this.products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );

    const limit = params?.limit ?? 100;
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
    this.syncFromStorage();
    const cat = category.trim().toLowerCase();
    const filtered = this.products.filter(
      (p) => p.category.toLowerCase() === cat || p.categoryName?.toLowerCase() === cat
    );

    const limit = params?.limit ?? 100;
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

  public async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      discountedPrice: productData.price * (1 - (productData.discountPercentage || 0) / 100),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.unshift(newProduct);
    this.saveToStorage();

    return {
      success: true,
      data: newProduct,
    };
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    this.syncFromStorage();
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', `Product '${id}' not found for update`),
      };
    }

    const current = this.products[idx];
    const newPrice = updates.price !== undefined ? updates.price : current.price;
    const newDiscount = updates.discountPercentage !== undefined ? updates.discountPercentage : current.discountPercentage;
    const discountedPrice = newPrice * (1 - newDiscount / 100);

    const newStock = updates.stock !== undefined ? updates.stock : current.stock;
    const availability =
      updates.availability !== undefined
        ? updates.availability
        : newStock > 0
        ? 'in_stock'
        : 'out_of_stock';

    const updated: Product = {
      ...current,
      ...updates,
      price: newPrice,
      discountPercentage: newDiscount,
      discountedPrice,
      stock: newStock,
      availability,
      updatedAt: new Date().toISOString(),
    };

    this.products[idx] = updated;
    this.saveToStorage();

    return {
      success: true,
      data: updated,
    };
  }

  public async deleteProduct(id: string): Promise<ApiResponse<{ readonly id: string }>> {
    this.syncFromStorage();
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      return {
        success: false,
        error: createAppError('NOT_FOUND', `Product '${id}' not found for deletion`),
      };
    }

    this.products.splice(idx, 1);
    this.saveToStorage();

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('shopsphere_admin_deleted_product_ids');
        const deletedIds: string[] = raw ? JSON.parse(raw) : [];
        if (!deletedIds.includes(id)) {
          deletedIds.push(id);
          localStorage.setItem('shopsphere_admin_deleted_product_ids', JSON.stringify(deletedIds));
        }
      } catch {
        // Ignore storage error
      }
    }

    return {
      success: true,
      data: { id },
    };
  }

  public async updateInventory(id: string, stock: number): Promise<ApiResponse<Product>> {
    return this.updateProduct(id, {
      stock,
      availability: stock > 0 ? 'in_stock' : 'out_of_stock',
    });
  }
}

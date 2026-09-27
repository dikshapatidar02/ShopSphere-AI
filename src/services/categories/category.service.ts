import type { ApiResponse, Category } from '@/types';
import { apiConfig } from '../api/config';
import { globalCache, SimpleCache } from '../cache/simple-cache';
import { MockCategoryProvider } from '../mocks/category.mock-provider';
import { DummyJsonCategoryProvider } from './category.dummyjson-provider';
import type { ICategoryProvider } from './category.provider';

export class CategoryService {
  constructor(
    private provider: ICategoryProvider,
    private cache: SimpleCache = globalCache
  ) {}

  public async getCategories(
    signal?: AbortSignal
  ): Promise<ApiResponse<readonly Category[]>> {
    const cacheKey = 'categories_list';

    const cached = this.cache.get<readonly Category[]>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const res = await this.provider.getCategories(signal);
    if (res.success) {
      this.cache.set(cacheKey, res.data, apiConfig.cacheTtlMs);
      return res;
    }

    const fallback = this.cache.getLastKnown<readonly Category[]>(cacheKey);
    if (fallback) {
      return { success: true, data: fallback };
    }

    return res;
  }
}

export function createCategoryService(
  providerType: 'dummyjson' | 'mock' = apiConfig.defaultProvider
): CategoryService {
  const provider =
    providerType === 'mock'
      ? new MockCategoryProvider()
      : new DummyJsonCategoryProvider();
  return new CategoryService(provider);
}

export const categoryService = createCategoryService();

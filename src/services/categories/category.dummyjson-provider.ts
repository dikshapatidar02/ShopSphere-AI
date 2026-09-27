import type { ApiResponse, Category, DummyJsonCategoryDTO } from '@/types';
import { apiClient, ApiClient } from '../api/client';
import { normalizeCategories } from './category.mapper';
import type { ICategoryProvider } from './category.provider';

export class DummyJsonCategoryProvider implements ICategoryProvider {
  constructor(private client: ApiClient = apiClient) {}

  public async getCategories(
    signal?: AbortSignal
  ): Promise<ApiResponse<readonly Category[]>> {
    const res = await this.client.get<Array<string | DummyJsonCategoryDTO>>(
      '/products/categories',
      { signal }
    );

    if (!res.success) {
      return res;
    }

    return {
      success: true,
      data: normalizeCategories(res.data || []),
    };
  }
}

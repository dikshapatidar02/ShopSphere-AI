import type { ApiResponse, Category } from '@/types';

export interface ICategoryProvider {
  getCategories(signal?: AbortSignal): Promise<ApiResponse<readonly Category[]>>;
}

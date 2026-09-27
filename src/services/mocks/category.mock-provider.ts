import type { ApiResponse, Category } from '@/types';
import type { ICategoryProvider } from '../categories/category.provider';
import { MOCK_CATEGORIES } from './data/categories.seed';

export class MockCategoryProvider implements ICategoryProvider {
  private categories: readonly Category[];

  constructor(seedCategories: readonly Category[] = MOCK_CATEGORIES) {
    this.categories = seedCategories;
  }

  public async getCategories(): Promise<ApiResponse<readonly Category[]>> {
    return {
      success: true,
      data: this.categories,
    };
  }
}

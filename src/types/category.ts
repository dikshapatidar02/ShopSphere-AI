export interface Category {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly imageUrl?: string;
  readonly parentId?: string;
  readonly productCount?: number;
}

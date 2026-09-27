export type ProductAvailability =
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'discontinued';

export interface ProductAttribute {
  readonly name: string;
  readonly value: string;
}

export interface ProductVariant {
  readonly id: string;
  readonly sku?: string;
  readonly title: string;
  readonly attributes: Record<string, string>;
  readonly priceOverride?: number;
  readonly stock: number;
  readonly availability: ProductAvailability;
  readonly imageUrl?: string;
}

export interface ProductSpecification {
  readonly group?: string;
  readonly name: string;
  readonly value: string;
}

export interface Product {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly categoryName?: string;
  readonly brand: string;
  readonly price: number;
  readonly discountPercentage: number;
  readonly discountedPrice: number;
  readonly rating: number;
  readonly reviewCount: number;
  readonly stock: number;
  readonly availability: ProductAvailability;
  readonly images: readonly string[];
  readonly thumbnail: string;
  readonly tags: readonly string[];
  readonly specifications: readonly ProductSpecification[];
  readonly variants: readonly ProductVariant[];
  readonly isFeatured?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

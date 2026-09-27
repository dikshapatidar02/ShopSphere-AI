import type { AppError } from './error';

export type ApiRequestState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiPaginationMeta {
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
  readonly page: number;
  readonly totalPages: number;
}

export type ApiResponse<T> =
  | { readonly success: true; readonly data: T; readonly meta?: ApiPaginationMeta }
  | { readonly success: false; readonly error: AppError };

/**
 * Raw DTO structure from DummyJSON API.
 * Keeps external API concerns isolated from domain Product model.
 */
export interface DummyJsonReviewDTO {
  readonly rating: number;
  readonly comment: string;
  readonly date: string;
  readonly reviewerName: string;
  readonly reviewerEmail: string;
}

export interface DummyJsonDimensionsDTO {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
}

export interface DummyJsonMetaDTO {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly barcode: string;
  readonly qrCode: string;
}

export interface DummyJsonProductDTO {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly price: number;
  readonly discountPercentage: number;
  readonly rating: number;
  readonly stock: number;
  readonly tags: readonly string[];
  readonly brand?: string;
  readonly sku?: string;
  readonly weight?: number;
  readonly dimensions?: DummyJsonDimensionsDTO;
  readonly warrantyInformation?: string;
  readonly shippingInformation?: string;
  readonly availabilityStatus?: string;
  readonly reviews?: readonly DummyJsonReviewDTO[];
  readonly returnPolicy?: string;
  readonly minimumOrderQuantity?: number;
  readonly meta?: DummyJsonMetaDTO;
  readonly images: readonly string[];
  readonly thumbnail: string;
}

export interface DummyJsonProductsResponseDTO {
  readonly products: readonly DummyJsonProductDTO[];
  readonly total: number;
  readonly skip: number;
  readonly limit: number;
}

export interface DummyJsonCategoryDTO {
  readonly slug: string;
  readonly name: string;
  readonly url: string;
}

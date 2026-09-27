export type CartItemAvailability =
  | 'available'
  | 'low_stock'
  | 'out_of_stock'
  | 'price_changed'
  | 'unavailable';

export interface Coupon {
  readonly code: string;
  readonly discountType: 'percentage' | 'fixed';
  readonly discountValue: number;
  readonly minOrderAmount?: number;
  readonly maxDiscountAmount?: number;
  readonly expiresAt?: string;
  readonly isValid: boolean;
  readonly validationError?: string;
}

export interface CartItem {
  readonly id: string;
  readonly productId: string;
  readonly productTitle: string;
  readonly productThumbnail: string;
  readonly productCategory: string;
  readonly productBrand: string;
  readonly selectedVariantId?: string;
  readonly selectedAttributes?: Record<string, string>;
  readonly unitPrice: number;
  readonly originalUnitPrice: number;
  readonly priceChanged: boolean;
  readonly quantity: number;
  readonly maxAvailableStock: number;
  readonly availability: CartItemAvailability;
  readonly isSavedForLater?: boolean;
  readonly addedAt: string;
}

export interface CartSummary {
  readonly subtotal: number;
  readonly discountTotal: number;
  readonly couponDiscount: number;
  readonly shippingTotal: number;
  readonly taxTotal: number;
  readonly grandTotal: number;
  readonly itemCount: number;
  readonly appliedCoupon?: Coupon;
}

export interface Cart {
  readonly id: string;
  readonly userId?: string;
  readonly items: readonly CartItem[];
  readonly savedItems: readonly CartItem[];
  readonly summary: CartSummary;
  readonly updatedAt: string;
}

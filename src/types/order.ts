import type { Address } from './address';
import type { DeliveryOption, MockPaymentDetails } from './checkout';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  readonly id: string;
  readonly productId: string;
  readonly productTitle: string;
  readonly productThumbnail: string;
  readonly selectedVariantId?: string;
  readonly variantAttributes?: Record<string, string>;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly totalPrice: number;
}

export interface TrackingEvent {
  readonly id: string;
  readonly status: OrderStatus;
  readonly location: string;
  readonly timestamp: string;
  readonly description: string;
}

export interface OrderTracking {
  readonly orderId: string;
  readonly carrierName?: string;
  readonly trackingNumber?: string;
  readonly currentStatus: OrderStatus;
  readonly estimatedDeliveryDate: string;
  readonly events: readonly TrackingEvent[];
}

export interface Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly userId: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly items: readonly OrderItem[];
  readonly shippingAddress: Address;
  readonly billingAddress: Address;
  readonly deliveryOption: DeliveryOption;
  readonly subtotal: number;
  readonly discountTotal: number;
  readonly shippingTotal: number;
  readonly taxTotal: number;
  readonly grandTotal: number;
  readonly paymentDetails: MockPaymentDetails;
  readonly status: OrderStatus;
  readonly tracking: OrderTracking;
  readonly createdAt: string;
  readonly updatedAt: string;
}

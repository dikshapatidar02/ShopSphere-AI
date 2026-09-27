import type { Address } from './address';
import type { Coupon } from './cart';

export type CheckoutStep =
  | 'customer_info'
  | 'shipping_address'
  | 'delivery_method'
  | 'payment_method'
  | 'review_order'
  | 'confirmation';

export interface DeliveryOption {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly estimatedDays: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed';

export type MockPaymentMethod =
  | 'mock_credit_card'
  | 'mock_upi'
  | 'mock_net_banking'
  | 'mock_cod';

export interface MockPaymentDetails {
  readonly method: MockPaymentMethod;
  readonly simulatedAccountName?: string;
  readonly status: PaymentStatus;
  readonly transactionId?: string;
  readonly paidAt?: string;
  readonly errorMessage?: string;
}

export interface CheckoutCustomerInfo {
  readonly email: string;
  readonly fullName: string;
  readonly phone: string;
}

export interface CheckoutState {
  readonly currentStep: CheckoutStep;
  readonly customerInfo: CheckoutCustomerInfo | null;
  readonly shippingAddress: Address | null;
  readonly billingAddress: Address | null;
  readonly useSameAddressForBilling: boolean;
  readonly selectedDeliveryOption: DeliveryOption | null;
  readonly paymentDetails: MockPaymentDetails | null;
  readonly coupon: Coupon | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
}

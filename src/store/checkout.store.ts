import type { Address, CheckoutStep, DeliveryOption, MockPaymentDetails, MockPaymentMethod } from '@/types';
import { create } from 'zustand';

export const DEFAULT_DELIVERY_OPTIONS: readonly DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivered in 3 to 5 business days',
    price: 15.0,
    estimatedDays: '3-5 Business Days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Priority handling & faster delivery',
    price: 25.0,
    estimatedDays: '1-2 Business Days',
  },
  {
    id: 'overnight',
    name: 'Overnight Air',
    description: 'Guaranteed next business day delivery',
    price: 45.0,
    estimatedDays: 'Next Business Day',
  },
];

export interface CheckoutStoreState {
  readonly currentStep: CheckoutStep;
  readonly shippingAddress: Address | null;
  readonly billingAddress: Address | null;
  readonly useSameAddressForBilling: boolean;
  readonly selectedDeliveryOption: DeliveryOption;
  readonly selectedPaymentMethod: MockPaymentMethod;
  readonly paymentDetails: MockPaymentDetails | null;
  readonly isProcessing: boolean;
  readonly error: string | null;
}

export interface CheckoutStoreActions {
  setStep(step: CheckoutStep): void;
  setShippingAddress(address: Address | null): void;
  setBillingAddress(address: Address | null): void;
  setUseSameAddressForBilling(val: boolean): void;
  setDeliveryOption(option: DeliveryOption): void;
  setPaymentMethod(method: MockPaymentMethod): void;
  setPaymentDetails(details: MockPaymentDetails | null): void;
  setIsProcessing(isProcessing: boolean): void;
  setError(error: string | null): void;
  resetCheckout(): void;
}

export type CheckoutStore = CheckoutStoreState & CheckoutStoreActions;

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  currentStep: 'shipping_address',
  shippingAddress: null,
  billingAddress: null,
  useSameAddressForBilling: true,
  selectedDeliveryOption: DEFAULT_DELIVERY_OPTIONS[0],
  selectedPaymentMethod: 'mock_credit_card',
  paymentDetails: null,
  isProcessing: false,
  error: null,

  setStep: (currentStep: CheckoutStep) => set({ currentStep }),
  setShippingAddress: (shippingAddress: Address | null) => set({ shippingAddress }),
  setBillingAddress: (billingAddress: Address | null) => set({ billingAddress }),
  setUseSameAddressForBilling: (useSameAddressForBilling: boolean) => set({ useSameAddressForBilling }),
  setDeliveryOption: (selectedDeliveryOption: DeliveryOption) => set({ selectedDeliveryOption }),
  setPaymentMethod: (selectedPaymentMethod: MockPaymentMethod) => set({ selectedPaymentMethod }),
  setPaymentDetails: (paymentDetails: MockPaymentDetails | null) => set({ paymentDetails }),
  setIsProcessing: (isProcessing: boolean) => set({ isProcessing }),
  setError: (error: string | null) => set({ error }),

  resetCheckout: () =>
    set({
      currentStep: 'shipping_address',
      shippingAddress: null,
      billingAddress: null,
      useSameAddressForBilling: true,
      selectedDeliveryOption: DEFAULT_DELIVERY_OPTIONS[0],
      selectedPaymentMethod: 'mock_credit_card',
      paymentDetails: null,
      isProcessing: false,
      error: null,
    }),
}));

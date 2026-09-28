import type { MockPaymentDetails, MockPaymentMethod } from '@/types';

export interface ProcessPaymentOptions {
  readonly simulateFailure?: boolean;
  readonly cardDetails?: {
    readonly cardNumber?: string;
    readonly cardHolderName?: string;
    readonly expiryDate?: string;
  };
  readonly upiId?: string;
}

export interface IPaymentProvider {
  processPayment(
    method: MockPaymentMethod,
    amount: number,
    options?: ProcessPaymentOptions
  ): Promise<MockPaymentDetails>;
}

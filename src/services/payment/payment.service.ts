import type { MockPaymentDetails, MockPaymentMethod } from '@/types';
import { mockPaymentProvider } from './mock-payment.provider';
import type { IPaymentProvider, ProcessPaymentOptions } from './payment.provider';

export class PaymentService {
  constructor(private provider: IPaymentProvider = mockPaymentProvider) {}

  public async processPayment(
    method: MockPaymentMethod,
    amount: number,
    options?: ProcessPaymentOptions
  ): Promise<MockPaymentDetails> {
    return this.provider.processPayment(method, amount, options);
  }
}

export const paymentService = new PaymentService();

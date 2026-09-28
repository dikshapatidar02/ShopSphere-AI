import type { MockPaymentDetails, MockPaymentMethod } from '@/types';
import type { IPaymentProvider, ProcessPaymentOptions } from './payment.provider';

export class MockPaymentProvider implements IPaymentProvider {
  public async processPayment(
    method: MockPaymentMethod,
    amount: number,
    options?: ProcessPaymentOptions
  ): Promise<MockPaymentDetails> {
    // Artificial small delay for simulation
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (options?.simulateFailure || (options?.cardDetails?.cardNumber && options.cardDetails.cardNumber.endsWith('4002'))) {
      return {
        method,
        status: 'failed',
        errorMessage: 'Payment declined by bank. (Simulated test failure)',
      };
    }

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const accountNameMap: Record<MockPaymentMethod, string> = {
      mock_credit_card: options?.cardDetails?.cardHolderName || 'Demo Credit Card',
      mock_upi: options?.upiId || 'demo@upi',
      mock_net_banking: 'Demo Bank Account',
      mock_cod: 'Cash on Delivery',
    };

    return {
      method,
      simulatedAccountName: accountNameMap[method],
      status: 'successful',
      transactionId,
      paidAt: new Date().toISOString(),
    };
  }
}

export const mockPaymentProvider = new MockPaymentProvider();

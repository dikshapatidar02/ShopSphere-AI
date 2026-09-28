import { describe, expect, it } from 'vitest';
import { paymentService } from '../payment.service';

describe('PaymentService (Mock)', () => {
  it('processes payment successfully for valid options', async () => {
    const res = await paymentService.processPayment('mock_credit_card', 150.0, {
      cardDetails: { cardNumber: '4000000000001234' },
    });

    expect(res.status).toBe('successful');
    expect(res.transactionId).toBeDefined();
    expect(res.paidAt).toBeDefined();
  });

  it('handles deterministic payment failure simulation when card ends in 4002', async () => {
    const res = await paymentService.processPayment('mock_credit_card', 150.0, {
      cardDetails: { cardNumber: '4000000000004002' },
    });

    expect(res.status).toBe('failed');
    expect(res.errorMessage).toContain('declined');
  });

  it('handles deterministic failure when simulateFailure option is set', async () => {
    const res = await paymentService.processPayment('mock_upi', 50.0, {
      simulateFailure: true,
    });

    expect(res.status).toBe('failed');
    expect(res.errorMessage).toBeDefined();
  });
});

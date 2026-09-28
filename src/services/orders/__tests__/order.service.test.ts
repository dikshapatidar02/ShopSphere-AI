import type { Address, DeliveryOption, MockPaymentDetails } from '@/types';
import { describe, expect, it } from 'vitest';
import { orderService } from '../order.service';

const mockAddr: Address = {
  id: 'addr-1',
  recipientName: 'Alex Johnson',
  line1: '123 Market St',
  city: 'San Francisco',
  state: 'CA',
  postalCode: '94105',
  country: 'United States',
};

const mockDelivery: DeliveryOption = {
  id: 'standard',
  name: 'Standard Shipping',
  description: '3-5 days',
  price: 0,
  estimatedDays: '3-5 Days',
};

const mockPayment: MockPaymentDetails = {
  method: 'mock_credit_card',
  status: 'successful',
  transactionId: 'TXN_TEST_123',
};

describe('OrderService', () => {
  it('creates an order with snapshots and tracking timeline', async () => {
    const res = await orderService.createOrder({
      userId: 'test-user-1',
      customerName: 'Alex Johnson',
      customerEmail: 'alex@example.com',
      items: [
        {
          id: 'item-1',
          productId: 'p-1',
          productTitle: 'Test Product',
          productThumbnail: 'https://example.com/thumb.jpg',
          unitPrice: 50,
          quantity: 2,
          totalPrice: 100,
        },
      ],
      shippingAddress: mockAddr,
      billingAddress: mockAddr,
      deliveryOption: mockDelivery,
      subtotal: 100,
      discountTotal: 0,
      shippingTotal: 0,
      taxTotal: 8,
      grandTotal: 108,
      paymentDetails: mockPayment,
    });

    expect(res.success).toBe(true);

    if (res.success) {
      expect(res.data.orderNumber).toMatch(/^ORD-/);
      expect(res.data.status).toBe('placed');
      expect(res.data.items.length).toBe(1);
      expect(res.data.tracking.events.length).toBeGreaterThan(0);
    }
  });

  it('fetches orders by userId and isolates user data', async () => {
    const listUser1 = await orderService.getOrdersByUserId('test-user-1');
    const listUser2 = await orderService.getOrdersByUserId('test-user-2');

    expect(listUser1.success).toBe(true);

    if (listUser1.success) {
      expect(listUser1.data.length).toBeGreaterThan(0);
    }

    if (listUser2.success) {
      expect(listUser2.data.length).toBe(0);
    }
  });

  it('returns error when requesting nonexistent or unauthorized orderId', async () => {
    const res = await orderService.getOrderById('non-existent-id', 'test-user-1');
    expect(res.success).toBe(false);

    if (!res.success) {
      expect(res.error.message).toContain('not found');
    }
  });
});

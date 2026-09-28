import { getSafeStorage } from '@/lib/storage';
import type { ApiResponse, Order, OrderTracking } from '@/types';
import type { CreateOrderParams, IOrderProvider } from './order.provider';

function getOrdersStorageKey(userId: string): string {
  return `shopsphere_orders_${userId || 'guest'}`;
}

function loadPersistedOrders(userId: string): Order[] {
  try {
    const raw = getSafeStorage().getItem(getOrdersStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistOrders(userId: string, orders: readonly Order[]): void {
  try {
    getSafeStorage().setItem(getOrdersStorageKey(userId), JSON.stringify(orders));
  } catch {
    // Ignore storage quota error
  }
}

export class MockOrderProvider implements IOrderProvider {
  public async createOrder(params: CreateOrderParams): Promise<ApiResponse<Order>> {
    const now = new Date();
    const orderId = `order_${now.getTime()}`;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    const estDeliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const tracking: OrderTracking = {
      orderId,
      carrierName: 'ShopSphere Express Courier',
      trackingNumber: `TRACK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      currentStatus: 'placed',
      estimatedDeliveryDate: estDeliveryDate,
      events: [
        {
          id: `evt-1-${now.getTime()}`,
          status: 'placed',
          location: 'ShopSphere AI Order Processing Center',
          timestamp: now.toISOString(),
          description: 'Order placed and payment authorized.',
        },
        {
          id: `evt-2-${now.getTime()}`,
          status: 'confirmed',
          location: 'Fulfillment Hub',
          timestamp: new Date(now.getTime() + 1000 * 60 * 5).toISOString(),
          description: 'Order details verified & queued for packing.',
        },
      ],
    };

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      items: params.items,
      shippingAddress: params.shippingAddress,
      billingAddress: params.billingAddress,
      deliveryOption: params.deliveryOption,
      subtotal: params.subtotal,
      discountTotal: params.discountTotal,
      shippingTotal: params.shippingTotal,
      taxTotal: params.taxTotal,
      grandTotal: params.grandTotal,
      paymentDetails: params.paymentDetails,
      status: 'placed',
      tracking,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const existingOrders = loadPersistedOrders(params.userId);
    const updatedOrders = [newOrder, ...existingOrders];
    persistOrders(params.userId, updatedOrders);

    return {
      success: true,
      data: newOrder,
    };
  }

  public async getOrdersByUserId(userId: string): Promise<ApiResponse<readonly Order[]>> {
    const orders = loadPersistedOrders(userId);
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      success: true,
      data: orders,
    };
  }

  public async getOrderById(orderId: string, userId: string): Promise<ApiResponse<Order>> {
    const orders = loadPersistedOrders(userId);
    const found = orders.find((o) => o.id === orderId && o.userId === userId);

    if (!found) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Order not found or you are not authorized to view this order.',
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      success: true,
      data: found,
    };
  }
}

export const mockOrderProvider = new MockOrderProvider();

import { getSafeStorage } from '@/lib/storage';
import type { ApiResponse, Order, OrderStatus, OrderTracking } from '@/types';
import type { CreateOrderParams, IOrderProvider } from './order.provider';
import { SEED_ADMIN_ORDERS } from '../mocks/data/admin-orders.seed';

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
    let orders = loadPersistedOrders(userId);
    if (orders.length === 0) {
      // Return user specific seed orders if available
      orders = SEED_ADMIN_ORDERS.filter((o) => o.userId === userId) as Order[];
    }
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return {
      success: true,
      data: orders,
    };
  }

  public async getOrderById(orderId: string, userId: string): Promise<ApiResponse<Order>> {
    const res = await this.getOrdersByUserId(userId);
    if (!res.success) return res;
    const orders = res.data;
    const found = orders.find((o: Order) => o.id === orderId && o.userId === userId);

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

  public async getAllOrdersAdmin(): Promise<ApiResponse<readonly Order[]>> {
    const allOrdersMap = new Map<string, Order>();

    // Seed orders first
    for (const seedOrder of SEED_ADMIN_ORDERS) {
      allOrdersMap.set(seedOrder.id, seedOrder as Order);
    }

    // Scan localStorage keys for user orders
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storage = window.localStorage;
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && key.startsWith('shopsphere_orders_')) {
            const raw = storage.getItem(key);
            if (raw) {
              const parsed: Order[] = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                for (const o of parsed) {
                  allOrdersMap.set(o.id, o);
                }
              }
            }
          }
        }
      } catch {
        // Ignore storage errors
      }
    }

    const allOrders = Array.from(allOrdersMap.values());
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      success: true,
      data: allOrders,
    };
  }

  public async getOrderByIdAdmin(orderId: string): Promise<ApiResponse<Order>> {
    const res = await this.getAllOrdersAdmin();
    if (!res.success) return res;
    const orders = res.data;
    const found = orders.find((o: Order) => o.id === orderId || o.orderNumber === orderId);

    if (!found) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Order with ID or Number '${orderId}' not found.`,
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      success: true,
      data: found,
    };
  }

  public async updateOrderStatusAdmin(
    orderId: string,
    newStatus: OrderStatus
  ): Promise<ApiResponse<Order>> {
    const findRes = await this.getOrderByIdAdmin(orderId);
    if (!findRes.success || !findRes.data) {
      return findRes;
    }

    const targetOrder = findRes.data;
    const nowIso = new Date().toISOString();

    const newEvent = {
      id: `evt_admin_${Date.now()}`,
      status: newStatus,
      location: 'ShopSphere AI Fulfillment Hub',
      timestamp: nowIso,
      description: `Order status updated to '${newStatus}' by ShopSphere Administrator.`,
    };

    const updatedOrder: Order = {
      ...targetOrder,
      status: newStatus,
      updatedAt: nowIso,
      tracking: {
        ...targetOrder.tracking,
        currentStatus: newStatus,
        events: [newEvent, ...targetOrder.tracking.events],
      },
    };

    // Update in user storage
    const userOrders = loadPersistedOrders(targetOrder.userId);
    const existingIndex = userOrders.findIndex((o) => o.id === targetOrder.id);

    let updatedList: Order[];
    if (existingIndex >= 0) {
      updatedList = [...userOrders];
      updatedList[existingIndex] = updatedOrder;
    } else {
      updatedList = [updatedOrder, ...userOrders];
    }
    persistOrders(targetOrder.userId, updatedList);

    return {
      success: true,
      data: updatedOrder,
    };
  }
}

export const mockOrderProvider = new MockOrderProvider();

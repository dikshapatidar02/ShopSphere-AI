import type { ApiResponse, Order } from '@/types';
import { mockOrderProvider } from './mock-order.provider';
import type { CreateOrderParams, IOrderProvider } from './order.provider';

export class OrderService {
  constructor(private provider: IOrderProvider = mockOrderProvider) {}

  public async createOrder(params: CreateOrderParams): Promise<ApiResponse<Order>> {
    return this.provider.createOrder(params);
  }

  public async getOrdersByUserId(userId: string): Promise<ApiResponse<readonly Order[]>> {
    return this.provider.getOrdersByUserId(userId);
  }

  public async getOrderById(orderId: string, userId: string): Promise<ApiResponse<Order>> {
    return this.provider.getOrderById(orderId, userId);
  }

  public async getAllOrdersAdmin(): Promise<ApiResponse<readonly Order[]>> {
    if (this.provider.getAllOrdersAdmin) {
      return this.provider.getAllOrdersAdmin();
    }
    return { success: true, data: [] };
  }

  public async getOrderByIdAdmin(orderId: string): Promise<ApiResponse<Order>> {
    if (this.provider.getOrderByIdAdmin) {
      return this.provider.getOrderByIdAdmin(orderId);
    }
    return {
      success: false,
      error: { code: 'NOT_FOUND', message: 'Order not found', timestamp: new Date().toISOString() },
    };
  }

  public async updateOrderStatusAdmin(
    orderId: string,
    status: Order['status']
  ): Promise<ApiResponse<Order>> {
    if (this.provider.updateOrderStatusAdmin) {
      return this.provider.updateOrderStatusAdmin(orderId, status);
    }
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Order status update not supported', timestamp: new Date().toISOString() },
    };
  }
}

export const orderService = new OrderService();

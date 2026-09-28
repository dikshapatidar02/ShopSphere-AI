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
}

export const orderService = new OrderService();

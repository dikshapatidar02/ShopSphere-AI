import type { ApiResponse, Order } from '@/types';

export type CreateOrderParams = Omit<
  Order,
  'id' | 'orderNumber' | 'status' | 'tracking' | 'createdAt' | 'updatedAt'
>;

export interface IOrderProvider {
  createOrder(params: CreateOrderParams): Promise<ApiResponse<Order>>;
  getOrdersByUserId(userId: string): Promise<ApiResponse<readonly Order[]>>;
  getOrderById(orderId: string, userId: string): Promise<ApiResponse<Order>>;
}

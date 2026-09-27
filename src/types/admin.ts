import type { StrategyPerformanceMetrics } from './analytics';
import type { OrderStatus } from './order';
import type { Product, ProductAvailability } from './product';

export interface AdminRecentOrderSummary {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerName: string;
  readonly total: number;
  readonly status: OrderStatus;
  readonly createdAt: string;
}

export interface AdminTopSellingProduct {
  readonly product: Product;
  readonly unitsSold: number;
  readonly revenue: number;
}

export interface AdminDashboardMetrics {
  readonly totalProducts: number;
  readonly totalOrders: number;
  readonly totalCustomers: number;
  readonly totalSimulatedRevenue: number;
  readonly simulatedConversionRate: number;
  readonly lowStockCount: number;
  readonly outOfStockCount: number;
  readonly topSellingProducts: readonly AdminTopSellingProduct[];
  readonly recentOrdersSummary: readonly AdminRecentOrderSummary[];
  readonly recommendationPerformance: readonly StrategyPerformanceMetrics[];
}

export interface AdminProductFilter {
  readonly search?: string;
  readonly category?: string;
  readonly availability?: ProductAvailability;
  readonly minStock?: number;
  readonly maxStock?: number;
}

export interface AdminOrderFilter {
  readonly search?: string;
  readonly status?: OrderStatus;
  readonly startDate?: string;
  readonly endDate?: string;
}

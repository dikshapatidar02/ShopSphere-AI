import { productService } from '@/services/products/product.service';
import { orderService } from '@/services/orders/order.service';
import { adminAnalyticsService, type AdminOverviewMetrics } from './admin-analytics.service';
import type { ApiResponse, Order, Product } from '@/types';
import type { ProductListResponse } from '@/services/products/product.provider';

export class AdminService {
  /**
   * Aggregate high-level simulated business metrics for the /admin overview dashboard.
   */
  public async getOverviewMetrics(): Promise<ApiResponse<AdminOverviewMetrics>> {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        orderService.getAllOrdersAdmin(),
      ]);

      const products: readonly Product[] = productsRes.success ? productsRes.data.products : [];
      const orders: readonly Order[] = ordersRes.success ? ordersRes.data : [];

      // Derive customer emails
      const customerEmails = new Set<string>();
      orders.forEach((o: Order) => {
        if (o.customerEmail) customerEmails.add(o.customerEmail.toLowerCase());
      });

      // Add baseline mock customer emails if low
      if (customerEmails.size < 5) {
        customerEmails.add('alex.johnson@example.com');
        customerEmails.add('marcus.vance@example.com');
        customerEmails.add('elena.rostova@example.com');
        customerEmails.add('sam.taylor@example.com');
        customerEmails.add('jessica.w@example.com');
      }

      // Compute total simulated revenue from non-cancelled orders
      const validOrders = orders.filter((o: Order) => o.status !== 'cancelled');
      const simulatedRevenue = validOrders.reduce((sum: number, o: Order) => sum + (o.grandTotal || 0), 0);

      // Low stock products (stock <= 5 or availability is low_stock/out_of_stock)
      const lowStockProducts = products
        .filter((p: Product) => p.stock <= 5 || p.availability === 'low_stock' || p.availability === 'out_of_stock')
        .map((p: Product) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          stock: p.stock,
          availability: p.availability,
        }));

      // Calculate units sold per product from orders
      const productSalesMap = new Map<string, number>();
      orders.forEach((o: Order) => {
        if (o.status !== 'cancelled') {
          o.items.forEach((item) => {
            const current = productSalesMap.get(item.productId) || 0;
            productSalesMap.set(item.productId, current + item.quantity);
          });
        }
      });

      // Rank top products by units sold or price
      const topProducts = products
        .map((p: Product) => {
          const unitsSold = productSalesMap.get(p.id) || Math.floor(p.rating * 12);
          const revenue = Number((unitsSold * p.discountedPrice).toFixed(2));
          return {
            id: p.id,
            title: p.title,
            category: p.category,
            price: p.discountedPrice,
            unitsSold,
            simulatedRevenue: revenue,
            stock: p.stock,
          };
        })
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, 5);

      // Recommendation strategy performance metrics
      const strategyMetrics = adminAnalyticsService.getStrategyPerformanceMetrics();
      const strategyList = Object.values(strategyMetrics);

      const totalImpressions = strategyList.reduce((acc, s) => acc + s.impressions, 0);
      const totalClicks = strategyList.reduce((acc, s) => acc + s.clicks, 0);
      const totalConversions = strategyList.reduce((acc, s) => acc + s.conversions, 0);
      const totalSimulatedRevenue = strategyList.reduce((acc, s) => acc + s.simulatedRevenue, 0);
      const averageCTR = totalImpressions > 0 ? Number((totalClicks / totalImpressions).toFixed(4)) : 0;

      // Derived simulated conversion rate (e.g., total orders / estimated sessions)
      const simulatedConversionRate = 0.034; // 3.4% baseline simulated conversion rate

      return {
        success: true,
        data: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCustomers: customerEmails.size,
          simulatedRevenue: Number(simulatedRevenue.toFixed(2)),
          simulatedConversionRate,
          topProducts,
          lowStockProducts,
          recommendationAnalyticsSummary: {
            totalImpressions,
            totalClicks,
            totalConversions,
            averageCTR,
            totalSimulatedRevenue: Number(totalSimulatedRevenue.toFixed(2)),
          },
        },
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN',
          message: err instanceof Error ? err.message : 'Failed to compute admin overview metrics',
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  // Product Administration Facades
  public async getProducts(params?: { category?: string; query?: string; stock?: string }): Promise<ApiResponse<ProductListResponse>> {
    const res = await productService.getProducts({ limit: 100 });
    if (!res.success) return res;

    let items = [...res.data.products];
    if (params?.query && params.query.trim()) {
      const q = params.query.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (params?.category && params.category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.stock && params.stock !== 'all') {
      if (params.stock === 'in_stock') items = items.filter((p) => p.stock > 0);
      else if (params.stock === 'low_stock') items = items.filter((p) => p.stock > 0 && p.stock <= 5);
      else if (params.stock === 'out_of_stock') items = items.filter((p) => p.stock === 0);
    }

    return {
      success: true,
      data: {
        products: items,
        total: items.length,
        skip: 0,
        limit: items.length,
      },
    };
  }

  public async getProductById(id: string): Promise<ApiResponse<Product>> {
    return productService.getProductById(id);
  }

  public async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    return productService.createProduct(productData);
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    return productService.updateProduct(id, updates);
  }

  public async deleteProduct(id: string): Promise<ApiResponse<{ readonly id: string }>> {
    return productService.deleteProduct(id);
  }

  public async updateInventory(id: string, stock: number): Promise<ApiResponse<Product>> {
    return productService.updateInventory(id, stock);
  }

  // Order Administration Facades
  public async getAllOrders(params?: { query?: string; status?: string }): Promise<ApiResponse<readonly Order[]>> {
    const res = await orderService.getAllOrdersAdmin();
    if (!res.success) return res;

    let orders = [...res.data];
    if (params?.query && params.query.trim()) {
      const q = params.query.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }
    if (params?.status && params.status !== 'all') {
      orders = orders.filter((o) => o.status === params.status);
    }

    return {
      success: true,
      data: orders,
    };
  }

  public async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    return orderService.getOrderByIdAdmin(orderId);
  }

  public async updateOrderStatus(orderId: string, status: Order['status']): Promise<ApiResponse<Order>> {
    return orderService.updateOrderStatusAdmin(orderId, status);
  }
}

export const adminService = new AdminService();

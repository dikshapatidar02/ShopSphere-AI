import { describe, expect, it } from 'vitest';
import { adminService } from '../services/admin.service';
import type { OrderItem, TrackingEvent } from '@/types';

describe('AdminService & Business Logic', () => {
  it('fetches overview metrics with products, orders, and simulated revenue', async () => {
    const res = await adminService.getOverviewMetrics();
    expect(res.success).toBe(true);

    if (res.success) {
      expect(res.data.totalProducts).toBeGreaterThan(0);
      expect(res.data.totalOrders).toBeGreaterThanOrEqual(0);
      expect(res.data.totalCustomers).toBeGreaterThan(0);
      expect(res.data.simulatedRevenue).toBeGreaterThanOrEqual(0);
      expect(res.data.simulatedConversionRate).toBeGreaterThan(0);
      expect(Array.isArray(res.data.topProducts)).toBe(true);
      expect(Array.isArray(res.data.lowStockProducts)).toBe(true);
      expect(res.data.recommendationAnalyticsSummary).toBeDefined();
    }
  });

  it('performs product CRUD and inventory updates', async () => {
    // 1. Create product
    const createRes = await adminService.createProduct({
      title: 'Admin Test Headphones',
      description: 'High fidelity audio headphones for test suite',
      category: 'electronics',
      brand: 'TestBrand',
      price: 199.99,
      discountPercentage: 10,
      discountedPrice: 179.99,
      stock: 15,
      availability: 'in_stock',
      rating: 4.8,
      reviewCount: 5,
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
      tags: ['electronics', 'test'],
      specifications: [],
      variants: [],
      createdAt: new Date().toISOString(),
    });

    expect(createRes.success).toBe(true);
    if (!createRes.success) return;
    const createdId = createRes.data.id;
    expect(createdId).toBeDefined();

    // 2. Fetch product by ID
    const getRes = await adminService.getProductById(createdId);
    expect(getRes.success).toBe(true);
    if (getRes.success) {
      expect(getRes.data.title).toBe('Admin Test Headphones');
    }

    // 3. Update stock/inventory
    const invRes = await adminService.updateInventory(createdId, 3);
    expect(invRes.success).toBe(true);
    if (invRes.success) {
      expect(invRes.data.stock).toBe(3);
      expect(invRes.data.availability).toBe('in_stock');
    }

    // 4. Delete product
    const delRes = await adminService.deleteProduct(createdId);
    expect(delRes.success).toBe(true);

    const getAfterDel = await adminService.getProductById(createdId);
    expect(getAfterDel.success).toBe(false);
  });

  it('performs order status transitions', async () => {
    const allOrdersRes = await adminService.getAllOrders();
    expect(allOrdersRes.success).toBe(true);

    if (allOrdersRes.success && allOrdersRes.data.length > 0) {
      const targetOrder = allOrdersRes.data[0];
      const updateRes = await adminService.updateOrderStatus(targetOrder.id, 'delivered');
      expect(updateRes.success).toBe(true);

      if (updateRes.success) {
        expect(updateRes.data.status).toBe('delivered');
        expect(updateRes.data.tracking.currentStatus).toBe('delivered');
        expect(updateRes.data.tracking.events.some((e: TrackingEvent) => e.status === 'delivered')).toBe(true);
      }
    }
  });

  it('preserves historical order snapshots when a product is deleted', async () => {
    // Fetch seed order with product item
    const allOrdersRes = await adminService.getAllOrders();
    expect(allOrdersRes.success).toBe(true);
    if (!allOrdersRes.success) return;

    const targetOrder = allOrdersRes.data[0];
    expect(targetOrder).toBeDefined();

    const historicalSnapshotItem = targetOrder.items[0];
    expect(historicalSnapshotItem).toBeDefined();

    // Delete underlying product if it exists
    await adminService.deleteProduct(historicalSnapshotItem.productId);

    // Order snapshot details must remain identical
    const fetchedOrderRes = await adminService.getOrderById(targetOrder.id);
    expect(fetchedOrderRes.success).toBe(true);
    if (fetchedOrderRes.success) {
      const orderItemAfterProductDelete = fetchedOrderRes.data.items.find(
        (i: OrderItem) => i.id === historicalSnapshotItem.id
      );

      expect(orderItemAfterProductDelete?.productTitle).toBe(historicalSnapshotItem.productTitle);
      expect(orderItemAfterProductDelete?.unitPrice).toBe(historicalSnapshotItem.unitPrice);
      expect(orderItemAfterProductDelete?.quantity).toBe(historicalSnapshotItem.quantity);
    }
  });
});

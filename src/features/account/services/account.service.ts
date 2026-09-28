import { addressService } from '@/services/addresses/address.service';
import { orderService } from '@/services/orders/order.service';
import { productService } from '@/services/products/product.service';
import { personalizationSignalTracker, recommendationService } from '@/services/recommendations';
import { reviewService } from '@/services/reviews/review.service';
import { preferencesService, type AccountPreferences } from '@/services/account/preferences.service';
import type { Order, Product, RecommendationResponse } from '@/types';

export interface AccountOverviewData {
  readonly ordersCount: number;
  readonly wishlistCount: number;
  readonly recentlyViewedCount: number;
  readonly addressesCount: number;
  readonly reviewsCount: number;
  readonly recentOrders: readonly Order[];
  readonly recentlyViewedProducts: readonly Product[];
  readonly recommendations: RecommendationResponse | null;
}

export class AccountService {
  /**
   * Fetches unified account overview data for the authenticated user.
   */
  public async getOverview(
    userId: string,
    wishlistCount: number
  ): Promise<AccountOverviewData> {
    // 1. Fetch Orders
    const ordersRes = await orderService.getOrdersByUserId(userId);
    const orders = ordersRes.success && ordersRes.data ? ordersRes.data : [];

    // 2. Fetch Addresses
    const addresses = addressService.getAddresses(userId);

    // 3. Fetch Reviews
    const reviews = reviewService.getReviewsByUserId(userId);

    // 4. Fetch Recently Viewed Products
    const signals = personalizationSignalTracker.getSignals(userId);
    const recentIds = signals.recentlyViewedProductIds.slice(0, 4);

    const recentlyViewedProducts: Product[] = [];
    if (recentIds.length > 0) {
      const allRes = await productService.getProducts({ limit: 100 });
      if (allRes.success && allRes.data) {
        const productMap = new Map(allRes.data.products.map((p) => [p.id, p]));
        for (const id of recentIds) {
          const found = productMap.get(id);
          if (found) recentlyViewedProducts.push(found);
        }
      }
    }

    // 5. Fetch Recommendation Preview
    let recs: RecommendationResponse | null = null;
    try {
      recs = await recommendationService.getPersonalizedForYou(userId, 4);
    } catch {
      // Fallback
    }

    return {
      ordersCount: orders.length,
      wishlistCount,
      recentlyViewedCount: signals.recentlyViewedProductIds.length,
      addressesCount: addresses.length,
      reviewsCount: reviews.length,
      recentOrders: orders.slice(0, 3),
      recentlyViewedProducts,
      recommendations: recs,
    };
  }

  /**
   * Fetches user orders with ownership validation.
   */
  public async getUserOrders(userId: string): Promise<readonly Order[]> {
    const res = await orderService.getOrdersByUserId(userId);
    return res.success && res.data ? res.data : [];
  }

  /**
   * Fetches specific order ensuring user ownership match.
   */
  public async getUserOrderById(
    userId: string,
    orderId: string
  ): Promise<Order | null> {
    const res = await orderService.getOrderById(orderId, userId);
    if (!res.success || !res.data) return null;

    // Enforce User Isolation Ownership Check
    if (res.data.userId && res.data.userId !== userId) {
      return null; // Return null if order belongs to another user!
    }

    return res.data;
  }

  /**
   * Fetches recently viewed products for user.
   */
  public async getRecentlyViewedProducts(userId: string): Promise<readonly Product[]> {
    const signals = personalizationSignalTracker.getSignals(userId);
    const recentIds = signals.recentlyViewedProductIds;

    if (recentIds.length === 0) return [];

    const allRes = await productService.getProducts({ limit: 100 });
    if (!allRes.success || !allRes.data) return [];

    const productMap = new Map(allRes.data.products.map((p) => [p.id, p]));
    const result: Product[] = [];
    for (const id of recentIds) {
      const p = productMap.get(id);
      if (p) result.push(p);
    }

    return result;
  }

  /**
   * Fetches account user preferences.
   */
  public getPreferences(userId: string): AccountPreferences {
    return preferencesService.getPreferences(userId);
  }

  /**
   * Saves account user preferences.
   */
  public savePreferences(
    userId: string,
    preferences: AccountPreferences
  ): AccountPreferences {
    return preferencesService.savePreferences(userId, preferences);
  }
}

export const accountService = new AccountService();

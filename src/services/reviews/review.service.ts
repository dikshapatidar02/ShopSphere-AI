import { getSafeStorage } from '@/lib/storage';
import type { Review, ReviewRating } from '@/types/review';
import { orderService } from '../orders/order.service';

const STORAGE_PREFIX = 'shopsphere_user_reviews_';

/**
 * User-scoped Review Service.
 * Manages product reviews written by authenticated customers and verifies purchase eligibility.
 */
export class ReviewService {
  private getStorageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId}`;
  }

  public getReviewsByUserId(userId: string): readonly Review[] {
    if (!userId) return [];
    try {
      const raw = getSafeStorage().getItem(this.getStorageKey(userId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }

    // Default mock seed reviews for Alex Johnson (demo account)
    if (userId === 'user_1' || userId === 'user_demo') {
      const initial: Review[] = [
        {
          id: 'rev_101',
          productId: '1',
          userId,
          userName: 'Alex Johnson',
          rating: 5,
          title: 'Outstanding quality and battery life',
          comment: 'Exceeded my expectations! The display is crisp and performance is ultra-fast.',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: 'rev_102',
          productId: '3',
          userId,
          userName: 'Alex Johnson',
          rating: 4,
          title: 'Great noise cancellation',
          comment: 'Really good sound clarity and fast Bluetooth pairing.',
          verifiedPurchase: true,
          createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
        },
      ];
      this.saveReviews(userId, initial);
      return initial;
    }

    return [];
  }

  public async getEligibleProductsForReview(userId: string): Promise<readonly string[]> {
    if (!userId) return [];
    const ordersRes = await orderService.getOrdersByUserId(userId);
    if (!ordersRes.success || !ordersRes.data) return [];

    const productIds = new Set<string>();
    for (const order of ordersRes.data) {
      for (const item of order.items) {
        productIds.add(item.productId);
      }
    }

    return Array.from(productIds);
  }

  public createReview(
    userId: string,
    userName: string,
    params: {
      productId: string;
      rating: ReviewRating;
      title: string;
      comment: string;
      verifiedPurchase?: boolean;
    }
  ): Review {
    const existing = [...this.getReviewsByUserId(userId)];

    const newReview: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      productId: params.productId,
      userId,
      userName: userName || 'Customer',
      rating: params.rating,
      title: params.title.trim(),
      comment: params.comment.trim(),
      verifiedPurchase: params.verifiedPurchase ?? true,
      createdAt: new Date().toISOString(),
    };

    const updated = [newReview, ...existing];
    this.saveReviews(userId, updated);
    return newReview;
  }

  public updateReview(
    userId: string,
    reviewId: string,
    params: {
      rating?: ReviewRating;
      title?: string;
      comment?: string;
    }
  ): Review | null {
    const existing = [...this.getReviewsByUserId(userId)];
    const index = existing.findIndex((r) => r.id === reviewId && r.userId === userId);

    if (index === -1) return null;

    const target = existing[index];
    const updatedReview: Review = {
      ...target,
      rating: params.rating ?? target.rating,
      title: params.title ? params.title.trim() : target.title,
      comment: params.comment ? params.comment.trim() : target.comment,
      updatedAt: new Date().toISOString(),
    };

    existing[index] = updatedReview;
    this.saveReviews(userId, existing);
    return updatedReview;
  }

  public deleteReview(userId: string, reviewId: string): boolean {
    const existing = this.getReviewsByUserId(userId);
    const filtered = existing.filter((r) => !(r.id === reviewId && r.userId === userId));

    if (filtered.length === existing.length) return false;

    this.saveReviews(userId, filtered);
    return true;
  }

  private saveReviews(userId: string, reviews: readonly Review[]): void {
    try {
      getSafeStorage().setItem(this.getStorageKey(userId), JSON.stringify(reviews));
    } catch {
      // Storage quota fallback
    }
  }
}

export const reviewService = new ReviewService();

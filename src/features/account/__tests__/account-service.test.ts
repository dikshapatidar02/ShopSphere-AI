import { describe, expect, it } from 'vitest';
import { AccountService } from '../services/account.service';
import { reviewService } from '@/services/reviews/review.service';
import { preferencesService } from '@/services/account/preferences.service';

describe('AccountService & User Isolation', () => {
  it('fetches unified overview data for user', async () => {
    const service = new AccountService();
    const overview = await service.getOverview('user_1', 3);

    expect(overview).toBeDefined();
    expect(overview.wishlistCount).toBe(3);
    expect(Array.isArray(overview.recentOrders)).toBe(true);
  });

  it('enforces ownership check on getUserOrderById', async () => {
    const service = new AccountService();

    // Order belonging to user_1
    const order = await service.getUserOrderById('user_1', 'ord_1001');

    // Attempting to access with wrong userId 'user_hacker' should return null
    const unauthorizedOrder = await service.getUserOrderById('user_hacker', 'ord_1001');

    if (order) {
      expect(order.id).toBe('ord_1001');
      expect(unauthorizedOrder).toBeNull();
    } else {
      expect(unauthorizedOrder).toBeNull();
    }
  });

  it('manages user-scoped reviews', () => {
    const reviews = reviewService.getReviewsByUserId('user_demo');
    expect(reviews.length).toBeGreaterThan(0);

    const created = reviewService.createReview('user_demo', 'Alex Johnson', {
      productId: '1',
      rating: 5,
      title: 'Amazing Product',
      comment: 'Top quality product!',
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Amazing Product');

    const updatedReviews = reviewService.getReviewsByUserId('user_demo');
    expect(updatedReviews.some((r) => r.id === created.id)).toBe(true);
  });

  it('manages user-scoped preferences', () => {
    const prefs = preferencesService.getPreferences('user_1');
    expect(prefs.enablePersonalization).toBe(true);

    const updated = preferencesService.savePreferences('user_1', {
      ...prefs,
      enablePersonalization: false,
    });

    expect(updated.enablePersonalization).toBe(false);
  });
});

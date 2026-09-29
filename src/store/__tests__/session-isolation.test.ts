import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { createTestProduct, createTestUser } from '../../../tests/factories';
import { describe, expect, it, beforeEach } from 'vitest';

describe('User / Session Isolation & Cross-User Security', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
    useCartStore.getState().clearCart();
    useWishlistStore.getState().clearWishlist();
  });

  it('ensures User A cart data is completely isolated from User B', () => {
    const userA = createTestUser({ id: 'user-a', email: 'userA@example.com' });
    const userB = createTestUser({ id: 'user-b', email: 'userB@example.com' });
    const productX = createTestProduct({ id: 'prod-x', title: 'Product X' });

    // User A logs in and adds Product X
    useAuthStore.getState().setSession({
      token: 'token-a',
      expiresAt: '2030-01-01T00:00:00Z',
      user: userA,
    });
    useCartStore.getState().loadUserCart('user-a');
    useCartStore.getState().addItem(productX, 1);

    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].productId).toBe('prod-x');

    // Logout User A
    useAuthStore.getState().logout();
    useCartStore.getState().loadUserCart(null);

    // User B logs in
    useAuthStore.getState().setSession({
      token: 'token-b',
      expiresAt: '2030-01-01T00:00:00Z',
      user: userB,
    });
    useCartStore.getState().loadUserCart('user-b');

    // Product X is NOT in User B's cart
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it('ensures User A wishlist is isolated from User B', () => {
    const userA = createTestUser({ id: 'user-a' });
    const userB = createTestUser({ id: 'user-b' });

    // User A adds to wishlist
    useAuthStore.getState().setSession({
      token: 'token-a',
      expiresAt: '2030-01-01T00:00:00Z',
      user: userA,
    });
    useWishlistStore.getState().loadUserWishlist('user-a');
    useWishlistStore.getState().addItem('prod-y');

    expect(useWishlistStore.getState().hasItem('prod-y')).toBe(true);

    // Switch to User B
    useAuthStore.getState().logout();
    useAuthStore.getState().setSession({
      token: 'token-b',
      expiresAt: '2030-01-01T00:00:00Z',
      user: userB,
    });
    useWishlistStore.getState().loadUserWishlist('user-b');

    expect(useWishlistStore.getState().hasItem('prod-y')).toBe(false);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';
import { useWishlistStore } from '../wishlist.store';

describe('Wishlist Store', () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
    useWishlistStore.getState().loadUserWishlist(null);
  });

  it('should add item and prevent duplicates', () => {
    const store = useWishlistStore.getState();
    store.addItem('prod-1');
    store.addItem('prod-1'); // Duplicate call

    const state = useWishlistStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.hasItem('prod-1')).toBe(true);
  });

  it('should toggle items cleanly', () => {
    const store = useWishlistStore.getState();
    store.toggleItem('prod-100');
    expect(useWishlistStore.getState().hasItem('prod-100')).toBe(true);

    store.toggleItem('prod-100');
    expect(useWishlistStore.getState().hasItem('prod-100')).toBe(false);
  });

  it('should isolate wishlist data across different users', () => {
    const store = useWishlistStore.getState();
    store.loadUserWishlist('user-1');
    store.addItem('prod-user1');
    expect(useWishlistStore.getState().hasItem('prod-user1')).toBe(true);

    store.loadUserWishlist('user-2');
    expect(useWishlistStore.getState().hasItem('prod-user1')).toBe(false);

    store.loadUserWishlist('user-1');
    expect(useWishlistStore.getState().hasItem('prod-user1')).toBe(true);
  });
});

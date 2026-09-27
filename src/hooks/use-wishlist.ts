'use client';

import { useWishlistStore } from '@/store/wishlist.store';

export function useWishlist() {
  const items = useWishlistStore((s) => s.items);

  const addItem = useWishlistStore((s) => s.addItem);
  const removeItem = useWishlistStore((s) => s.removeItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const hasItem = useWishlistStore((s) => s.hasItem);
  const clearWishlist = useWishlistStore((s) => s.clearWishlist);

  return {
    items,
    wishlistCount: items.length,
    isEmpty: items.length === 0,
    addItem,
    removeItem,
    toggleItem,
    hasItem,
    clearWishlist,
  };
}

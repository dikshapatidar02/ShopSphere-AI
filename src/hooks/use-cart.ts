'use client';

import { useCartStore } from '@/store/cart.store';

export function useCart() {
  const items = useCartStore((s) => s.items);
  const savedItems = useCartStore((s) => s.savedItems);
  const coupon = useCartStore((s) => s.coupon);
  const summary = useCartStore((s) => s.summary);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const saveForLater = useCartStore((s) => s.saveForLater);
  const moveToCart = useCartStore((s) => s.moveToCart);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  return {
    items,
    savedItems,
    coupon,
    summary,
    itemCount: summary.itemCount,
    isEmpty: items.length === 0,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    applyCoupon,
    removeCoupon,
  };
}

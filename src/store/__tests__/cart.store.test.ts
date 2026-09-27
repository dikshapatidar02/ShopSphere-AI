import type { Product } from '@/types';
import { beforeEach, describe, expect, it } from 'vitest';
import { useCartStore } from '../cart.store';

const mockProduct1: Product = {
  id: 'prod-test-1',
  title: 'Test Wireless Earbuds',
  description: 'High quality earbuds',
  category: 'audio',
  brand: 'AudioTech',
  price: 100,
  discountPercentage: 10,
  discountedPrice: 90,
  rating: 4.5,
  reviewCount: 20,
  stock: 10,
  availability: 'in_stock',
  images: ['https://example.com/img.jpg'],
  thumbnail: 'https://example.com/thumb.jpg',
  tags: ['audio'],
  specifications: [],
  variants: [],
};

const mockProduct2: Product = {
  id: 'prod-test-2',
  title: 'Out of Stock Watch',
  description: 'Smart watch',
  category: 'wearables',
  brand: 'WatchCo',
  price: 250,
  discountPercentage: 0,
  discountedPrice: 250,
  rating: 4.0,
  reviewCount: 5,
  stock: 0,
  availability: 'out_of_stock',
  images: ['https://example.com/img2.jpg'],
  thumbnail: 'https://example.com/thumb2.jpg',
  tags: ['wearable'],
  specifications: [],
  variants: [],
};

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().loadUserCart(null);
  });

  it('should add item and calculate summary correctly', () => {
    const store = useCartStore.getState();
    store.addItem(mockProduct1, 2);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(2);
    expect(state.summary.itemCount).toBe(2);
    expect(state.summary.subtotal).toBe(200); // 100 * 2
    expect(state.summary.discountTotal).toBe(20); // (100-90)*2
  });

  it('should merge duplicate items when adding existing product', () => {
    const store = useCartStore.getState();
    store.addItem(mockProduct1, 1);
    store.addItem(mockProduct1, 3);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(4);
  });

  it('should prevent adding out of stock products', () => {
    const store = useCartStore.getState();
    store.addItem(mockProduct2, 1);

    const state = useCartStore.getState();
    expect(state.items.length).toBe(0);
  });

  it('should clamp quantity to max available stock', () => {
    const store = useCartStore.getState();
    store.addItem(mockProduct1, 50); // stock is 10

    const state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(10);
  });

  it('should isolate cart state when switching users', () => {
    const store = useCartStore.getState();
    store.loadUserCart('user-A');
    store.addItem(mockProduct1, 1);
    expect(useCartStore.getState().items.length).toBe(1);

    // Switch to user B
    store.loadUserCart('user-B');
    expect(useCartStore.getState().items.length).toBe(0); // user B has empty cart

    // Switch back to user A
    store.loadUserCart('user-A');
    expect(useCartStore.getState().items.length).toBe(1); // user A cart restored
  });
});

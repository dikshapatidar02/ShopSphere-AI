import { getSafeStorage } from '@/lib/storage';
import type { WishlistItem } from '@/types';
import { create } from 'zustand';

export interface WishlistStoreState {
  readonly activeUserId: string | null;
  readonly items: readonly WishlistItem[];
}

export interface WishlistStoreActions {
  addItem(productId: string, note?: string): void;
  removeItem(productId: string): void;
  toggleItem(productId: string): void;
  hasItem(productId: string): boolean;
  clearWishlist(): void;
  loadUserWishlist(userId: string | null): void;
}

export type WishlistStore = WishlistStoreState & WishlistStoreActions;

function getWishlistStorageKey(userId: string | null): string {
  return `shopsphere_wishlist_${userId || 'guest'}`;
}

function loadPersistedWishlist(userId: string | null): WishlistItem[] {
  try {
    const raw = getSafeStorage().getItem(getWishlistStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistWishlistData(userId: string | null, items: readonly WishlistItem[]): void {
  try {
    getSafeStorage().setItem(getWishlistStorageKey(userId), JSON.stringify(items));
  } catch {
    // Ignore quota error
  }
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  activeUserId: null,
  items: loadPersistedWishlist(null),

  loadUserWishlist: (userId: string | null) => {
    const items = loadPersistedWishlist(userId);
    set({ activeUserId: userId, items });
  },

  addItem: (productId: string, note?: string) => {
    if (!productId) return;
    const { items, activeUserId } = get();

    if (items.some((i) => i.productId === productId)) return;

    const newItem: WishlistItem = {
      id: `witem-${productId}-${Date.now()}`,
      productId,
      addedAt: new Date().toISOString(),
      note,
    };

    const updated = [...items, newItem];
    set({ items: updated });
    persistWishlistData(activeUserId, updated);
  },

  removeItem: (productId: string) => {
    const { items, activeUserId } = get();
    const updated = items.filter((i) => i.productId !== productId);
    set({ items: updated });
    persistWishlistData(activeUserId, updated);
  },

  toggleItem: (productId: string) => {
    const { hasItem, addItem, removeItem } = get();
    if (hasItem(productId)) {
      removeItem(productId);
    } else {
      addItem(productId);
    }
  },

  hasItem: (productId: string): boolean => {
    return get().items.some((i) => i.productId === productId);
  },

  clearWishlist: () => {
    const { activeUserId } = get();
    set({ items: [] });
    persistWishlistData(activeUserId, []);
  },
}));

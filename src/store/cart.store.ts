import { getSafeStorage } from '@/lib/storage';
import type { CartItem, CartItemAvailability, CartSummary, Coupon, Product } from '@/types';
import { create } from 'zustand';

export interface CartStoreState {
  readonly activeUserId: string | null;
  readonly items: readonly CartItem[];
  readonly savedItems: readonly CartItem[];
  readonly coupon: Coupon | null;
  readonly summary: CartSummary;
}

export interface CartStoreActions {
  addItem(product: Product, quantity?: number, selectedVariantId?: string): void;
  removeItem(itemId: string): void;
  updateQuantity(itemId: string, quantity: number): void;
  clearCart(): void;
  saveForLater(itemId: string): void;
  moveToCart(itemId: string): void;
  applyCoupon(coupon: Coupon): void;
  removeCoupon(): void;
  loadUserCart(userId: string | null): void;
  revalidateItems(productsMap: Map<string, Product>): void;
}

export type CartStore = CartStoreState & CartStoreActions;

function calculateSummary(
  items: readonly CartItem[],
  coupon: Coupon | null
): CartSummary {
  const activeItems = items.filter((i) => !i.isSavedForLater);
  const subtotal = activeItems.reduce(
    (sum, item) => sum + item.originalUnitPrice * item.quantity,
    0
  );

  const discountTotal = activeItems.reduce(
    (sum, item) => sum + (item.originalUnitPrice - item.unitPrice) * item.quantity,
    0
  );

  const priceAfterProductDiscount = subtotal - discountTotal;
  let couponDiscount = 0;

  if (coupon && coupon.isValid) {
    if (coupon.discountType === 'percentage') {
      couponDiscount = (priceAfterProductDiscount * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && couponDiscount > coupon.maxDiscountAmount) {
        couponDiscount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'fixed') {
      couponDiscount = coupon.discountValue;
    }
  }

  couponDiscount = Math.min(couponDiscount, priceAfterProductDiscount);

  const shippingTotal = activeItems.length > 0 && priceAfterProductDiscount < 100 ? 15.0 : 0;
  const taxableAmount = Math.max(0, priceAfterProductDiscount - couponDiscount);
  const taxTotal = Math.round(taxableAmount * 0.08 * 100) / 100;
  const grandTotal = Math.round((taxableAmount + shippingTotal + taxTotal) * 100) / 100;
  const itemCount = activeItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountTotal: Math.round(discountTotal * 100) / 100,
    couponDiscount: Math.round(couponDiscount * 100) / 100,
    shippingTotal,
    taxTotal,
    grandTotal,
    itemCount,
    appliedCoupon: coupon || undefined,
  };
}

function getCartStorageKey(userId: string | null): string {
  return `shopsphere_cart_${userId || 'guest'}`;
}

function loadPersistedCartData(userId: string | null): {
  items: CartItem[];
  savedItems: CartItem[];
  coupon: Coupon | null;
} {
  try {
    const raw = getSafeStorage().getItem(getCartStorageKey(userId));
    if (!raw) return { items: [], savedItems: [], coupon: null };
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      savedItems: Array.isArray(parsed.savedItems) ? parsed.savedItems : [],
      coupon: parsed.coupon || null,
    };
  } catch {
    return { items: [], savedItems: [], coupon: null };
  }
}

function persistCartData(
  userId: string | null,
  items: readonly CartItem[],
  savedItems: readonly CartItem[],
  coupon: Coupon | null
): void {
  try {
    const data = JSON.stringify({ items, savedItems, coupon });
    getSafeStorage().setItem(getCartStorageKey(userId), data);
  } catch {
    // Ignore storage quota errors
  }
}

const initialPersisted = loadPersistedCartData(null);
const initialSummary = calculateSummary(initialPersisted.items, initialPersisted.coupon);

export const useCartStore = create<CartStore>((set, get) => ({
  activeUserId: null,
  items: initialPersisted.items,
  savedItems: initialPersisted.savedItems,
  coupon: initialPersisted.coupon,
  summary: initialSummary,

  loadUserCart: (userId: string | null) => {
    const data = loadPersistedCartData(userId);
    const summary = calculateSummary(data.items, data.coupon);
    set({
      activeUserId: userId,
      items: data.items,
      savedItems: data.savedItems,
      coupon: data.coupon,
      summary,
    });
  },

  addItem: (product: Product, quantityToAdd: number = 1, selectedVariantId?: string) => {
    if (!product || !product.id) return;
    const { items, activeUserId, coupon } = get();

    const stock = Math.max(0, product.stock);
    if (stock === 0) return;

    const itemId = selectedVariantId
      ? `${product.id}_${selectedVariantId}`
      : product.id;

    const existingIndex = items.findIndex((i) => i.id === itemId);
    let updatedItems: CartItem[];

    if (existingIndex >= 0) {
      const existing = items[existingIndex];
      const newQty = Math.min(stock, existing.quantity + Math.max(1, quantityToAdd));
      const updatedItem: CartItem = {
        ...existing,
        quantity: newQty,
        maxAvailableStock: stock,
      };
      updatedItems = [...items];
      updatedItems[existingIndex] = updatedItem;
    } else {
      const variant = selectedVariantId
        ? product.variants.find((v) => v.id === selectedVariantId)
        : undefined;

      const unitPrice = variant?.priceOverride ?? product.discountedPrice;
      const originalUnitPrice = variant?.priceOverride ?? product.price;

      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        productTitle: product.title,
        productThumbnail: product.thumbnail,
        productCategory: product.category,
        productBrand: product.brand,
        selectedVariantId,
        selectedAttributes: variant?.attributes,
        unitPrice,
        originalUnitPrice,
        priceChanged: false,
        quantity: Math.min(stock, Math.max(1, quantityToAdd)),
        maxAvailableStock: stock,
        availability: product.availability === 'out_of_stock' ? 'out_of_stock' : 'available',
        addedAt: new Date().toISOString(),
      };
      updatedItems = [...items, newItem];
    }

    const summary = calculateSummary(updatedItems, coupon);
    set({ items: updatedItems, summary });
    persistCartData(activeUserId, updatedItems, get().savedItems, coupon);
  },

  removeItem: (itemId: string) => {
    const { items, activeUserId, coupon } = get();
    const updatedItems = items.filter((i) => i.id !== itemId);
    const summary = calculateSummary(updatedItems, coupon);
    set({ items: updatedItems, summary });
    persistCartData(activeUserId, updatedItems, get().savedItems, coupon);
  },

  updateQuantity: (itemId: string, newQuantity: number) => {
    const { items, activeUserId, coupon } = get();
    const target = items.find((i) => i.id === itemId);
    if (!target) return;

    if (newQuantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const clampedQty = Math.min(target.maxAvailableStock, newQuantity);
    const updatedItems = items.map((i) =>
      i.id === itemId ? { ...i, quantity: clampedQty } : i
    );

    const summary = calculateSummary(updatedItems, coupon);
    set({ items: updatedItems, summary });
    persistCartData(activeUserId, updatedItems, get().savedItems, coupon);
  },

  clearCart: () => {
    const { activeUserId } = get();
    const summary = calculateSummary([], null);
    set({ items: [], coupon: null, summary });
    persistCartData(activeUserId, [], get().savedItems, null);
  },

  saveForLater: (itemId: string) => {
    const { items, savedItems, activeUserId, coupon } = get();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const updatedItems = items.filter((i) => i.id !== itemId);
    const updatedSaved = [...savedItems.filter((i) => i.id !== itemId), { ...item, isSavedForLater: true }];

    const summary = calculateSummary(updatedItems, coupon);
    set({ items: updatedItems, savedItems: updatedSaved, summary });
    persistCartData(activeUserId, updatedItems, updatedSaved, coupon);
  },

  moveToCart: (itemId: string) => {
    const { items, savedItems, activeUserId, coupon } = get();
    const item = savedItems.find((i) => i.id === itemId);
    if (!item) return;

    const updatedSaved = savedItems.filter((i) => i.id !== itemId);
    const updatedItems = [...items.filter((i) => i.id !== itemId), { ...item, isSavedForLater: false }];

    const summary = calculateSummary(updatedItems, coupon);
    set({ items: updatedItems, savedItems: updatedSaved, summary });
    persistCartData(activeUserId, updatedItems, updatedSaved, coupon);
  },

  applyCoupon: (coupon: Coupon) => {
    const { items, activeUserId } = get();
    const summary = calculateSummary(items, coupon);
    set({ coupon, summary });
    persistCartData(activeUserId, items, get().savedItems, coupon);
  },

  removeCoupon: () => {
    const { items, activeUserId } = get();
    const summary = calculateSummary(items, null);
    set({ coupon: null, summary });
    persistCartData(activeUserId, items, get().savedItems, null);
  },

  revalidateItems: (productsMap: Map<string, Product>) => {
    const { items, activeUserId, coupon } = get();
    let changed = false;

    const updatedItems: CartItem[] = items.map((item) => {
      const liveProduct = productsMap.get(item.productId);
      if (!liveProduct) return item;

      const stock = Math.max(0, liveProduct.stock);
      const isPriceDiff = Math.abs(liveProduct.discountedPrice - item.unitPrice) > 0.001;
      const isOut = stock === 0 || liveProduct.availability === 'out_of_stock';
      const isLow = stock > 0 && stock < 5;

      const newAvailability: CartItemAvailability = isOut
        ? 'out_of_stock'
        : isPriceDiff
        ? 'price_changed'
        : isLow
        ? 'low_stock'
        : 'available';

      const clampedQty = isOut ? item.quantity : Math.min(item.quantity, stock);

      if (
        item.maxAvailableStock !== stock ||
        item.availability !== newAvailability ||
        item.priceChanged !== isPriceDiff ||
        item.quantity !== clampedQty
      ) {
        changed = true;
        return {
          ...item,
          maxAvailableStock: stock,
          availability: newAvailability,
          priceChanged: isPriceDiff,
          quantity: clampedQty,
        };
      }
      return item;
    });

    if (changed) {
      const summary = calculateSummary(updatedItems, coupon);
      set({ items: updatedItems, summary });
      persistCartData(activeUserId, updatedItems, get().savedItems, coupon);
    }
  },
}));

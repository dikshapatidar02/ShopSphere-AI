'use client';

import { useCart } from '@/hooks/use-cart';
import { useCartRevalidation } from '../hooks/use-cart-revalidation';
import { CartEmptyState } from './CartEmptyState';
import { CartHeader } from './CartHeader';
import { CartItemList } from './CartItemList';
import { CartSummary } from './CartSummary';
import { SavedForLater } from './SavedForLater';
import { RecommendationRail } from '@/features/recommendations';

export function CartView() {
  const {
    items,
    savedItems,
    coupon,
    summary,
    itemCount,
    isEmpty,
    updateQuantity,
    removeItem,
    clearCart,
    saveForLater,
    moveToCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  useCartRevalidation();

  const cartProductIds = items.map((i) => i.productId);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <CartHeader itemCount={itemCount} onClearCart={clearCart} />

      {isEmpty && savedItems.length === 0 ? (
        <CartEmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Items Area (Cart + Saved for Later) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {!isEmpty ? (
              <CartItemList
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onSaveForLater={saveForLater}
              />
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
                Your active cart has no items. Items saved for later are listed below.
              </div>
            )}

            {/* Saved For Later Section */}
            <SavedForLater
              items={savedItems}
              onMoveToCart={moveToCart}
              onRemove={removeItem}
            />
          </div>

          {/* Cart Summary Sidebar */}
          {!isEmpty && (
            <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
              <CartSummary
                summary={summary}
                coupon={coupon}
                onApplyCoupon={applyCoupon}
                onRemoveCoupon={removeCoupon}
              />
            </div>
          )}
        </div>
      )}

      {/* Recommendation Rail */}
      <div className="pt-8 border-t border-border">
        <RecommendationRail
          strategy="cart_based"
          context={{ currentCartProductIds: cartProductIds }}
          limit={4}
        />
      </div>
    </main>
  );
}


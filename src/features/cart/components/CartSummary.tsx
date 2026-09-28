'use client';

import type { CartSummary as CartSummaryType, Coupon } from '@/types';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CouponSection } from './CouponSection';

interface CartSummaryProps {
  readonly summary: CartSummaryType;
  readonly coupon?: Coupon | null;
  readonly onApplyCoupon: (coupon: Coupon) => void;
  readonly onRemoveCoupon: () => void;
}

export function CartSummary({
  summary,
  coupon,
  onApplyCoupon,
  onRemoveCoupon,
}: CartSummaryProps) {
  const { subtotal, discountTotal, couponDiscount, shippingTotal, taxTotal, grandTotal, itemCount } = summary;

  return (
    <aside aria-label="Order Summary" className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <h2 className="text-lg font-bold tracking-tight text-foreground border-b border-border pb-3">
          Order Summary
        </h2>

        {/* Financial Breakdown */}
        <div className="space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
          </div>

          {discountTotal > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Product Discounts</span>
              <span>-${discountTotal.toFixed(2)}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Coupon Discount</span>
              <span>-${couponDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span>{shippingTotal === 0 ? <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong> : `$${shippingTotal.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Estimated Tax (8%)</span>
            <span className="font-semibold text-foreground">${taxTotal.toFixed(2)}</span>
          </div>

          <div className="pt-3 border-t border-border flex justify-between items-baseline">
            <span className="text-base font-bold text-foreground">Total</span>
            <span className="text-2xl font-extrabold text-foreground">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal < 100 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <Truck className="h-4 w-4" />
              <span>Add ${(100 - subtotal).toFixed(2)} more for FREE Shipping!</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Coupon Form */}
        <CouponSection
          appliedCoupon={coupon}
          subtotal={subtotal}
          onApplyCoupon={onApplyCoupon}
          onRemoveCoupon={onRemoveCoupon}
        />

        {/* Checkout Button Affordance */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            disabled={itemCount === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-[11px] text-center text-muted-foreground">
            Checkout flow will be implemented in Phase 08.
          </p>
        </div>

        {/* Guarantee Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/50">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Secure SSL Encrypted Checkout</span>
        </div>
      </div>
    </aside>
  );
}

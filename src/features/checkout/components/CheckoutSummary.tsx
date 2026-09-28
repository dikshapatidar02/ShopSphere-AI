'use client';

import type { CartSummary, DeliveryOption } from '@/types';
import { ShieldCheck, ShoppingBag } from 'lucide-react';

interface CheckoutSummaryProps {
  readonly summary: CartSummary;
  readonly selectedDeliveryOption: DeliveryOption;
}

export function CheckoutSummary({ summary, selectedDeliveryOption }: CheckoutSummaryProps) {
  const { subtotal, discountTotal, couponDiscount, taxTotal, itemCount } = summary;

  // Final shipping cost derived from selected delivery option
  const shippingFee = selectedDeliveryOption.price;
  const taxableAmount = Math.max(0, subtotal - discountTotal - couponDiscount);
  const grandTotal = Math.round((taxableAmount + shippingFee + taxTotal) * 100) / 100;

  return (
    <aside aria-label="Checkout Summary" className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
        <h3 className="text-base font-bold tracking-tight text-foreground border-b border-border pb-3 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-primary" />
          <span>Order Summary</span>
        </h3>

        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Items ({itemCount})</span>
            <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
          </div>

          {discountTotal > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Discounts</span>
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
            <span>Shipping ({selectedDeliveryOption.name})</span>
            <span>
              {shippingFee === 0 ? (
                <strong className="text-emerald-600 dark:text-emerald-400">FREE</strong>
              ) : (
                `$${shippingFee.toFixed(2)}`
              )}
            </span>
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

        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/50">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Guaranteed 256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>
    </aside>
  );
}

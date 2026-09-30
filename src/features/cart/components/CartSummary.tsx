'use client';

import type { CartSummary as CartSummaryType, Coupon } from '@/types';
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
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
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
        <h2 className="text-lg font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-3">
          Order Summary
        </h2>

        {/* Financial Breakdown */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
          </div>

          {discountTotal > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Product Discounts</span>
              <span>-${discountTotal.toFixed(2)}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Coupon Discount</span>
              <span>-${couponDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-600 font-medium">
            <span>Shipping</span>
            <span>{shippingTotal === 0 ? <strong className="text-emerald-700 font-bold uppercase">FREE</strong> : `$${shippingTotal.toFixed(2)}`}</span>
          </div>

          <div className="flex justify-between text-slate-600 font-medium">
            <span>Estimated Tax (8%)</span>
            <span className="font-bold text-slate-900">${taxTotal.toFixed(2)}</span>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-base font-extrabold text-slate-900">Total</span>
            <span className="text-2xl font-extrabold text-slate-900">${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Free Shipping Progress Indicator */}
        {subtotal < 50 && (
          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-800 font-bold">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Add ${(50 - subtotal).toFixed(2)} more for FREE Shipping!</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (subtotal / 50) * 100)}%` }}
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

        {/* Checkout Link Affordance */}
        <div className="space-y-2 pt-2">
          <Link
            href="/checkout"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-bold shadow-xs transition-all active:scale-[0.99]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-[11px] text-center text-slate-500 font-medium">
            Secure checkout & easy order management.
          </p>
        </div>

        {/* Guarantee Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-600 font-semibold border-t border-slate-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Safe & Secure Checkout</span>
        </div>
      </div>
    </aside>
  );
}

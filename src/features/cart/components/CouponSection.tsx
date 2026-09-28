'use client';

import type { Coupon } from '@/types';
import { Check, Tag, X } from 'lucide-react';
import { useState } from 'react';
import { validateCoupon } from '../utils/coupon-validator';

interface CouponSectionProps {
  readonly appliedCoupon?: Coupon | null;
  readonly subtotal: number;
  readonly onApplyCoupon: (coupon: Coupon) => void;
  readonly onRemoveCoupon: () => void;
}

export function CouponSection({
  appliedCoupon,
  subtotal,
  onApplyCoupon,
  onRemoveCoupon,
}: CouponSectionProps) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = validateCoupon(code, subtotal);
    if (result.isValid) {
      onApplyCoupon(result);
      setCode('');
    } else {
      setErrorMessage(result.validationError || 'Invalid coupon code.');
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Tag className="h-4 w-4 text-primary" />
        <span>Promo Code / Coupon</span>
      </div>

      {appliedCoupon && appliedCoupon.isValid ? (
        <div className="flex items-center justify-between gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>
              Coupon <strong className="uppercase">{appliedCoupon.code}</strong> Applied!
            </span>
          </div>
          <button
            type="button"
            onClick={onRemoveCoupon}
            aria-label="Remove coupon"
            className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-emerald-500/20 transition-colors focus:outline-none"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter promo code (e.g. WELCOME10)"
              aria-label="Promo code input"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="rounded-lg bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            >
              Apply
            </button>
          </div>

          {errorMessage && (
            <p className="text-xs text-destructive font-medium" role="alert">
              {errorMessage}
            </p>
          )}

          <p className="text-[11px] text-muted-foreground">
            Try codes: <code className="font-mono text-foreground font-semibold">WELCOME10</code> (10% off) or{' '}
            <code className="font-mono text-foreground font-semibold">SAVE20</code> ($20 off).
          </p>
        </form>
      )}
    </div>
  );
}

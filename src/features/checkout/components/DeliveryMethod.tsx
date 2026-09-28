'use client';

import { DEFAULT_DELIVERY_OPTIONS } from '@/store/checkout.store';
import type { DeliveryOption } from '@/types';
import { Check, Clock, Truck } from 'lucide-react';

interface DeliveryMethodProps {
  readonly selectedOption: DeliveryOption;
  readonly onSelectOption: (option: DeliveryOption) => void;
  readonly subtotal: number;
  readonly onNext: () => void;
  readonly onBack: () => void;
}

export function DeliveryMethod({
  selectedOption,
  onSelectOption,
  subtotal,
  onNext,
  onBack,
}: DeliveryMethodProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Select Delivery Method
        </h2>
        <p className="text-xs text-muted-foreground">
          Choose how quickly you would like your order to arrive.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {DEFAULT_DELIVERY_OPTIONS.map((opt) => {
          const isSelected = selectedOption.id === opt.id;

          // Free standard shipping if subtotal >= 100
          const displayPrice =
            opt.id === 'standard' && subtotal >= 100 ? 0 : opt.price;

          return (
            <div
              key={opt.id}
              onClick={() => onSelectOption({ ...opt, price: displayPrice })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectOption({ ...opt, price: displayPrice });
                }
              }}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-xs'
                  : 'border-border bg-card hover:border-foreground/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>{opt.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                    <Clock className="h-3 w-3" />
                    <span>Est. Delivery: {opt.estimatedDays}</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-bold text-sm text-foreground">
                {displayPrice === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                ) : (
                  `$${displayPrice.toFixed(2)}`
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-input bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

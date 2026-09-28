'use client';

import type { CheckoutStep } from '@/types';
import { Check, CreditCard, MapPin, ShoppingBag, Truck } from 'lucide-react';

interface CheckoutHeaderProps {
  readonly currentStep: CheckoutStep;
  readonly onStepClick: (step: CheckoutStep) => void;
}

const STEPS: { id: CheckoutStep; title: string; icon: React.ElementType }[] = [
  { id: 'shipping_address', title: '1. Shipping Address', icon: MapPin },
  { id: 'delivery_method', title: '2. Delivery Method', icon: Truck },
  { id: 'payment_method', title: '3. Payment', icon: CreditCard },
  { id: 'review_order', title: '4. Review & Place Order', icon: ShoppingBag },
];

export function CheckoutHeader({ currentStep, onStepClick }: CheckoutHeaderProps) {
  const getStepIndex = (step: CheckoutStep) => {
    switch (step) {
      case 'shipping_address':
        return 0;
      case 'delivery_method':
        return 1;
      case 'payment_method':
        return 2;
      case 'review_order':
      case 'confirmation':
        return 3;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStep);

  return (
    <nav aria-label="Checkout Progress" className="w-full border-b border-border pb-6">
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 scrollbar-none">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (isCompleted) {
                    onStepClick(step.id);
                  }
                }}
                disabled={!isCompleted && !isActive}
                aria-current={isActive ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 cursor-pointer'
                    : 'bg-muted/50 text-muted-foreground opacity-60 pointer-events-none'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Icon className="h-4 w-4 shrink-0" />
                )}
                <span>{step.title}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-12 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-border'}`} />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

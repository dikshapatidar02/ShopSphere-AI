'use client';

import { ArrowRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CheckoutEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6 max-w-md mx-auto">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-xs">
        <ShoppingBag className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Your Cart is Empty
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You need to add items to your cart before proceeding to checkout.
        </p>
      </div>

      <Link
        href="/products"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      >
        <span>Explore Products</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

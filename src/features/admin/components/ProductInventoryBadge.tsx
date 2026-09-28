'use client';

import { ProductAvailability } from '@/types';

interface ProductInventoryBadgeProps {
  readonly stock: number;
  readonly availability?: ProductAvailability;
}

export function ProductInventoryBadge({ stock, availability }: ProductInventoryBadgeProps) {
  let label = 'In Stock';
  let badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';

  if (stock === 0 || availability === 'out_of_stock' || availability === 'discontinued') {
    label = 'Out of Stock';
    badgeStyle = 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
  } else if (stock <= 5 || availability === 'low_stock') {
    label = `Low Stock (${stock})`;
    badgeStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
  } else {
    label = `In Stock (${stock})`;
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${badgeStyle}`}
    >
      {label}
    </span>
  );
}

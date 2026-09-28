'use client';

import { Minus, Plus } from 'lucide-react';

interface CartQuantityControlProps {
  readonly quantity: number;
  readonly maxQuantity: number;
  readonly onQuantityChange: (quantity: number) => void;
  readonly productTitle: string;
  readonly disabled?: boolean;
}

export function CartQuantityControl({
  quantity,
  maxQuantity,
  onQuantityChange,
  productTitle,
  disabled = false,
}: CartQuantityControlProps) {
  const isMin = quantity <= 1;
  const isMax = quantity >= maxQuantity;

  return (
    <div className="flex items-center rounded-lg border border-border bg-background p-1 shadow-xs">
      <button
        type="button"
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={disabled || isMin}
        aria-label={`Decrease quantity for ${productTitle}`}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40 disabled:pointer-events-none"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span
        className="w-10 text-center text-xs font-semibold text-foreground select-none"
        aria-label={`Current quantity for ${productTitle}: ${quantity}`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={disabled || isMax}
        aria-label={`Increase quantity for ${productTitle}`}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40 disabled:pointer-events-none"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

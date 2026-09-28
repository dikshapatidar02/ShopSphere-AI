'use client';

import { Minus, Plus } from 'lucide-react';

interface ProductQuantitySelectorProps {
  readonly quantity: number;
  readonly maxQuantity?: number;
  readonly onChange: (newQuantity: number) => void;
  readonly disabled?: boolean;
}

export function ProductQuantitySelector({
  quantity,
  maxQuantity = 99,
  onChange,
  disabled = false,
}: ProductQuantitySelectorProps) {
  const minQty = 1;
  const maxQty = Math.max(1, maxQuantity);

  const handleDecrease = () => {
    if (quantity > minQty && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQty && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && !disabled) {
      const clamped = Math.min(maxQty, Math.max(minQty, val));
      onChange(clamped);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="pdp-quantity-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Quantity
      </label>
      <div className="flex items-center rounded-lg border border-input bg-background shadow-xs">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={disabled || quantity <= minQty}
          aria-label="Decrease quantity"
          className="flex h-9 w-9 items-center justify-center rounded-l-lg text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <input
          id="pdp-quantity-input"
          type="number"
          min={minQty}
          max={maxQty}
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label="Product quantity"
          className="h-9 w-12 border-0 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={handleIncrease}
          disabled={disabled || quantity >= maxQty}
          aria-label="Increase quantity"
          className="flex h-9 w-9 items-center justify-center rounded-r-lg text-foreground hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

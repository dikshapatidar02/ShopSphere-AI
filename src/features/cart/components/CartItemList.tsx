'use client';

import type { CartItem as CartItemType } from '@/types';
import { CartItem } from './CartItem';

interface CartItemListProps {
  readonly items: readonly CartItemType[];
  readonly onUpdateQuantity: (itemId: string, quantity: number) => void;
  readonly onRemove: (itemId: string) => void;
  readonly onSaveForLater?: (itemId: string) => void;
}

export function CartItemList({
  items,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}: CartItemListProps) {
  return (
    <section aria-label="Cart Items List" className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
          onSaveForLater={onSaveForLater}
        />
      ))}
    </section>
  );
}

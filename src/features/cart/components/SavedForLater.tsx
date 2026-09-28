'use client';

import type { CartItem as CartItemType } from '@/types';
import { Bookmark } from 'lucide-react';
import { CartItem } from './CartItem';

interface SavedForLaterProps {
  readonly items: readonly CartItemType[];
  readonly onMoveToCart: (itemId: string) => void;
  readonly onRemove: (itemId: string) => void;
}

export function SavedForLater({
  items,
  onMoveToCart,
  onRemove,
}: SavedForLaterProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label="Saved for Later Section" className="mt-8 space-y-4 pt-6 border-t border-border">
      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Bookmark className="h-5 w-5 text-primary" />
        <h2>Saved for Later ({items.length})</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={() => {}}
            onRemove={onRemove}
            onMoveToCart={onMoveToCart}
          />
        ))}
      </div>
    </section>
  );
}

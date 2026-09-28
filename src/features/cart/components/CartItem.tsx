'use client';

import type { CartItem as CartItemType } from '@/types';
import { AlertCircle, Bookmark, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { CartQuantityControl } from './CartQuantityControl';

interface CartItemProps {
  readonly item: CartItemType;
  readonly onUpdateQuantity: (itemId: string, quantity: number) => void;
  readonly onRemove: (itemId: string) => void;
  readonly onSaveForLater?: (itemId: string) => void;
  readonly onMoveToCart?: (itemId: string) => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
  onMoveToCart,
}: CartItemProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';
  const [imageSrc, setImageSrc] = useState<string>(item.productThumbnail || fallbackImage);
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = item.availability === 'out_of_stock' || item.maxAvailableStock === 0;
  const isLowStock = item.availability === 'low_stock' || (item.maxAvailableStock > 0 && item.maxAvailableStock < 5);
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <article className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card shadow-xs transition-all hover:border-foreground/20">
      {/* Thumbnail */}
      <div className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
        <Image
          src={imageError ? fallbackImage : imageSrc}
          alt={item.productTitle}
          fill
          sizes="96px"
          onError={() => {
            setImageError(true);
            setImageSrc(fallbackImage);
          }}
          className="object-cover object-center"
        />
      </div>

      {/* Item Info & Actions */}
      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.productBrand} • <span className="capitalize">{item.productCategory}</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug hover:text-primary">
              <Link href={`/products/${item.productId}`} className="focus:outline-none focus:underline">
                {item.productTitle}
              </Link>
            </h3>
          </div>

          {/* Price */}
          <div className="text-left sm:text-right">
            <div className="text-base font-bold text-foreground">
              ${lineTotal.toFixed(2)}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-muted-foreground">
                (${item.unitPrice.toFixed(2)} each)
              </div>
            )}
          </div>
        </div>

        {/* Warnings & Badges */}
        <div className="space-y-1.5">
          {item.priceChanged && (
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>This item&apos;s price has changed since you added it.</span>
            </div>
          )}

          {isOutOfStock ? (
            <div className="inline-flex items-center gap-1.5 text-xs text-destructive font-medium">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Currently unavailable / out of stock</span>
            </div>
          ) : isLowStock ? (
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Low stock — Only {item.maxAvailableStock} remaining
            </div>
          ) : null}
        </div>

        {/* Controls & Options */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
          {!item.isSavedForLater ? (
            <CartQuantityControl
              quantity={item.quantity}
              maxQuantity={item.maxAvailableStock}
              onQuantityChange={(qty) => onUpdateQuantity(item.id, qty)}
              productTitle={item.productTitle}
              disabled={isOutOfStock}
            />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">Saved for later</span>
          )}

          <div className="flex items-center gap-3 text-xs">
            {!item.isSavedForLater && onSaveForLater && (
              <button
                type="button"
                onClick={() => onSaveForLater(item.id)}
                aria-label={`Save ${item.productTitle} for later`}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:underline"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>Save for later</span>
              </button>
            )}

            {item.isSavedForLater && onMoveToCart && (
              <button
                type="button"
                onClick={() => onMoveToCart(item.id)}
                disabled={isOutOfStock}
                aria-label={`Move ${item.productTitle} to cart`}
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
              >
                <span>Move to cart</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.productTitle} from cart`}
              className="inline-flex items-center gap-1 text-destructive/80 hover:text-destructive transition-colors focus:outline-none focus:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

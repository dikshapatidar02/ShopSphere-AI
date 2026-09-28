'use client';

import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/types';
import { Check, ShoppingBag, Star, Tag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface WishlistItemProps {
  readonly product: Product;
  readonly onRemove: (productId: string) => void;
}

export function WishlistItem({ product, onRemove }: WishlistItemProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';
  const [imageSrc, setImageSrc] = useState<string>(
    product.thumbnail || product.images[0] || fallbackImage
  );
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.availability === 'out_of_stock' || product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-all hover:shadow-md hover:border-foreground/20">
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Link
          href={`/products/${product.id}`}
          aria-label={`View details for ${product.title}`}
          className="block h-full w-full"
        >
          <Image
            src={imageError ? fallbackImage : imageSrc}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => {
              setImageError(true);
              setImageSrc(fallbackImage);
            }}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground shadow-xs">
            <Tag className="h-3 w-3" />
            <span>{Math.round(product.discountPercentage)}% OFF</span>
          </div>
        )}

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.title} from wishlist`}
          className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-xs hover:bg-destructive hover:text-destructive-foreground transition-colors focus:outline-none"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider">{product.brand}</span>
            <span className="capitalize">{product.categoryName || product.category}</span>
          </div>

          <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2 leading-snug hover:text-primary">
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          </h3>
        </div>

        {/* Rating & Price */}
        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs" aria-label={`Rating ${product.rating} out of 5 stars`}>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
            </div>

            <div className="text-right">
              <span className="text-base font-bold text-foreground">
                ${product.discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="ml-1.5 text-xs text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Action */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Add ${product.title} to cart`}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none'
            }`}
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added to Cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

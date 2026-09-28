'use client';

import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import type { Product } from '@/types';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AssistantProductCardProps {
  readonly product: Product;
  readonly index: number;
}

export function AssistantProductCard({ product, index }: AssistantProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) => s.hasItem(product.id));

  return (
    <article className="group relative flex items-center gap-3 rounded-lg border border-border bg-card p-2.5 shadow-xs transition-all hover:border-primary/40">
      {/* Index Badge */}
      <span className="absolute top-1.5 left-1.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
        {index + 1}
      </span>

      {/* Image */}
      <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={product.thumbnail || product.images[0] || '/placeholder.png'}
          alt={product.title}
          fill
          sizes="64px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between min-w-0 pr-1">
        <div>
          <h4 className="text-xs font-semibold text-foreground line-clamp-1 group-hover:text-primary">
            <Link href={`/products/${product.id}`} className="hover:underline">
              {product.title}
            </Link>
          </h4>
          <p className="text-[10px] text-muted-foreground capitalize">
            {product.brand} • {product.categoryName || product.category}
          </p>
        </div>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground">
              ${product.discountedPrice.toFixed(2)}
            </span>
            <div className="flex items-center text-[10px] text-amber-500 font-medium">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-0.5" />
              {product.rating.toFixed(1)}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Heart className={`h-3 w-3 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => addItem(product, 1)}
              aria-label={`Add ${product.title} to cart`}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

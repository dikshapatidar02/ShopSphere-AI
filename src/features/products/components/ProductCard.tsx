'use client';

import { useWishlist } from '@/hooks/use-wishlist';
import type { Product } from '@/types';
import { Heart, Star, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  readonly product: Product;
  readonly priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlist();
  const isWishlisted = hasItem(product.id);

  const [imageSrc, setImageSrc] = useState<string>(
    product.thumbnail || product.images[0] || '/placeholder.png'
  );
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';

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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1440px) 33vw, 25vw"
            priority={priority}
            onError={() => {
              setImageError(true);
              setImageSrc(fallbackImage);
            }}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleItem(product.id);
          }}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-xs hover:bg-background hover:text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground shadow-xs">
            <Tag className="h-3 w-3" />
            <span>{Math.round(product.discountPercentage)}% OFF</span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute bottom-2 right-2 z-10">
          {product.availability === 'out_of_stock' ? (
            <span className="inline-flex rounded-full bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium text-zinc-100 backdrop-blur-xs dark:bg-zinc-100/80 dark:text-zinc-900">
              Out of Stock
            </span>
          ) : product.availability === 'low_stock' ? (
            <span className="inline-flex rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium text-amber-950 backdrop-blur-xs">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-1">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium uppercase tracking-wider text-muted-foreground/80">
              {product.brand}
            </span>
            <span className="capitalize">{product.categoryName || product.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-primary">
            <Link href={`/products/${product.id}`} className="focus:outline-none focus:underline">
              {product.title}
            </Link>
          </h3>
        </div>

        {/* Rating & Price */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs" aria-label={`Rating ${product.rating} out of 5 stars`}>
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-foreground">
                ${product.discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

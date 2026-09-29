'use client';

import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import type { Product } from '@/types';
import { Check, Heart, ShoppingBag, Star, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  readonly product: Product;
  readonly priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { hasItem, toggleItem } = useWishlist();
  const { addItem } = useCart();
  const isWishlisted = hasItem(product.id);
  const [addedToCart, setAddedToCart] = useState(false);

  const [imageSrc, setImageSrc] = useState<string>(
    product.thumbnail || product.images[0] || '/placeholder.png'
  );
  const [imageError, setImageError] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700">
      {/* Product Image & Floating Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
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
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur-md hover:bg-white hover:text-rose-600 transition-all dark:bg-slate-900/90 dark:text-slate-300 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Heart className={`h-4 w-4 transition-transform active:scale-125 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-sm uppercase">
            <Tag className="h-3 w-3" />
            <span>{Math.round(product.discountPercentage)}% OFF</span>
          </div>
        )}

        {/* Availability Badge */}
        <div className="absolute bottom-3 right-3 z-10">
          {product.availability === 'out_of_stock' ? (
            <span className="inline-flex rounded-full bg-slate-900/90 px-2.5 py-1 text-[10px] font-bold text-slate-100 backdrop-blur-md shadow-xs">
              Out of Stock
            </span>
          ) : product.availability === 'low_stock' ? (
            <span className="inline-flex rounded-full bg-amber-500/95 px-2.5 py-1 text-[10px] font-bold text-slate-950 backdrop-blur-md shadow-xs">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Quick Add Button Overlay on Hover */}
        {product.availability !== 'out_of_stock' && (
          <div className="absolute inset-x-3 bottom-3 z-20 hidden group-hover:block transition-all duration-200">
            <button
              onClick={handleQuickAdd}
              className={`w-full h-10 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-blue-600 dark:bg-white dark:text-slate-900 dark:hover:bg-blue-500 dark:hover:text-white'
              }`}
            >
              {addedToCart ? (
                <>
                  <Check className="h-4 w-4" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Quick Add
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
        <div className="space-y-1">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>{product.brand}</span>
            <span className="capitalize text-slate-500 font-medium">{product.categoryName || product.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            <Link href={`/products/${product.id}`} className="focus:outline-none">
              {product.title}
            </Link>
          </h3>
        </div>

        {/* Rating & Price Section */}
        <div className="pt-2.5 border-t border-border/70 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs" aria-label={`Rating ${product.rating} out of 5 stars`}>
            <div className="flex items-center text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-medium text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                ${product.discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs text-slate-400 line-through font-medium">
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

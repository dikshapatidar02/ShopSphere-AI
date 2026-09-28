'use client';

import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import type { Product } from '@/types';
import { Check, Heart, ShieldCheck, ShoppingBag, Star, Tag, Truck } from 'lucide-react';
import { useState } from 'react';
import { ProductQuantitySelector } from './ProductQuantitySelector';

interface ProductInfoProps {
  readonly product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();
  const { hasItem, toggleItem } = useWishlist();

  const isWishlisted = hasItem(product.id);
  const isOutOfStock = product.availability === 'out_of_stock' || product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Brand & Category */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{product.brand}</span>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] text-secondary-foreground">
            {product.categoryName || product.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {product.title}
        </h1>
      </div>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-md text-amber-600 dark:text-amber-400 font-semibold" aria-label={`Rated ${product.rating} out of 5 stars`}>
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          Based on <strong className="text-foreground">{product.reviewCount}</strong> verified reviews
        </span>
      </div>

      {/* Pricing Section */}
      <div className="space-y-1 border-y border-border py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-foreground">
            ${product.discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-base text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                <Tag className="h-3 w-3" />
                Save {Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Includes all applicable taxes. Free shipping on orders over $100.
        </p>
      </div>

      {/* Stock & Availability Status */}
      <div className="flex items-center gap-3">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/10 dark:bg-zinc-100/10 px-3 py-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-zinc-500" />
            Currently Out of Stock
          </span>
        ) : product.availability === 'low_stock' ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            Low Stock — Only {product.stock} left in stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            In Stock ({product.stock} available)
          </span>
        )}
      </div>

      {/* Quantity Selector & Purchase Actions */}
      <div className="space-y-4 pt-2">
        <ProductQuantitySelector
          quantity={quantity}
          maxQuantity={product.stock}
          onChange={setQuantity}
          disabled={isOutOfStock}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none'
            }`}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added {quantity} to Cart!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Add {quantity} to Cart</span>
              </>
            )}
          </button>

          {/* Wishlist Toggle Button */}
          <button
            type="button"
            onClick={() => toggleItem(product.id)}
            aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-ring ${
              isWishlisted
                ? 'border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary shrink-0" />
          <span>Fast 2-3 Day Express Shipping</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>1 Year Standard Warranty</span>
        </div>
      </div>
    </div>
  );
}

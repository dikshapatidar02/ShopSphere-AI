'use client';

import { announceToScreenReader } from '@/components/common/AccessibilityAnnouncer';
import { useCart } from '@/hooks/use-cart';
import { useWishlist } from '@/hooks/use-wishlist';
import type { Product } from '@/types';
import { ArrowRight, Check, Heart, ShieldCheck, ShoppingBag, Star, Tag, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProductQuantitySelector } from './ProductQuantitySelector';

interface ProductInfoProps {
  readonly product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
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
    announceToScreenReader(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.title} to cart`);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="flex flex-col space-y-6 w-full">
      {/* Brand & Category */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600">
          <span>{product.brand}</span>
          <span className="rounded-md bg-slate-100 border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700">
            {product.categoryName || product.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-snug">
          {product.title}
        </h1>
      </div>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md text-amber-800 font-extrabold" aria-label={`Rated ${product.rating} out of 5 stars`}>
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
        <span className="text-xs text-slate-600 font-medium">
          Based on <strong className="text-slate-900 font-bold">{product.reviewCount}</strong> verified customer reviews
        </span>
      </div>

      {/* Pricing Section */}
      <div className="space-y-2 border-y border-slate-200 py-4">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            ${product.discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <>
              <span className="text-lg text-slate-400 line-through font-medium">
                ${product.price.toFixed(2)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-extrabold text-rose-700 uppercase tracking-wide">
                <Tag className="h-3.5 w-3.5" />
                Save {Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Taxes included. Standard shipping options calculated at checkout.
        </p>
      </div>

      {/* Stock & Availability Status */}
      <div className="flex items-center gap-3">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            Currently Out of Stock
          </span>
        ) : product.availability === 'low_stock' ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            Low Stock — Only {product.stock} left in inventory
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
            <Check className="h-3.5 w-3.5 text-emerald-600" />
            In Stock ({product.stock} units available)
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

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none'
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

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 text-sm font-bold shadow-xs transition-all disabled:opacity-50"
          >
            <span>Buy Now</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Wishlist Toggle Button */}
          <button
            type="button"
            onClick={() => toggleItem(product.id)}
            aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isWishlisted
                ? 'border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>Standard Delivery Options</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Verified Product Details</span>
        </div>
      </div>
    </div>
  );
}

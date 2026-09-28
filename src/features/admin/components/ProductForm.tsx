'use client';

import { Product, ProductAvailability } from '@/types';
import { AlertCircle, CheckCircle2, Save, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductFormProps {
  readonly initialValues?: Partial<Product>;
  readonly isEditing?: boolean;
  readonly isLoading?: boolean;
  readonly onSubmit: (values: Omit<Product, 'id'> | Partial<Product>) => Promise<void>;
}

export function ProductForm({
  initialValues,
  isEditing = false,
  isLoading = false,
  onSubmit,
}: ProductFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [category, setCategory] = useState(initialValues?.category || 'beauty');
  const [brand, setBrand] = useState(initialValues?.brand || 'ShopSphere');
  const [price, setPrice] = useState<number | string>(initialValues?.price ?? 29.99);
  const [discountPercentage, setDiscountPercentage] = useState<number | string>(
    initialValues?.discountPercentage ?? 0
  );
  const [stock, setStock] = useState<number | string>(initialValues?.stock ?? 10);
  const [availability, setAvailability] = useState<ProductAvailability>(
    initialValues?.availability || 'in_stock'
  );
  const [rating, setRating] = useState<number | string>(initialValues?.rating ?? 4.5);
  const [thumbnail, setThumbnail] = useState(
    initialValues?.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Form Validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setFormError('Product title is required.');
      return;
    }
    if (trimmedTitle.length > 120) {
      setFormError('Product title must not exceed 120 characters.');
      return;
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      setFormError('Product description is required.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setFormError('Price must be a non-negative number.');
      return;
    }

    const numDiscount = Number(discountPercentage);
    if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
      setFormError('Discount percentage must be between 0 and 100.');
      return;
    }

    const numStock = Number(stock);
    if (isNaN(numStock) || numStock < 0) {
      setFormError('Stock quantity must be a non-negative integer.');
      return;
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 5) {
      setFormError('Rating must be between 0 and 5.');
      return;
    }

    const numDiscountedPrice = numPrice * (1 - numDiscount / 100);

    const payload: Omit<Product, 'id'> = {
      title: trimmedTitle,
      description: trimmedDesc,
      category: category.trim().toLowerCase(),
      categoryName: category.charAt(0).toUpperCase() + category.slice(1),
      brand: brand.trim() || 'ShopSphere',
      price: numPrice,
      discountPercentage: numDiscount,
      discountedPrice: Number(numDiscountedPrice.toFixed(2)),
      stock: Math.floor(numStock),
      availability: numStock > 0 ? availability : 'out_of_stock',
      rating: numRating,
      reviewCount: initialValues?.reviewCount ?? 12,
      thumbnail: thumbnail.trim(),
      images: [thumbnail.trim()],
      tags: [category.trim().toLowerCase(), brand.trim().toLowerCase()],
      specifications: initialValues?.specifications || [
        { name: 'Category', value: category },
        { name: 'Brand', value: brand },
      ],
      variants: initialValues?.variants || [],
      updatedAt: new Date().toISOString(),
    };

    try {
      await onSubmit(payload);
      setFormSuccess(
        isEditing
          ? 'Product details updated successfully!'
          : 'New product created and added to store catalog!'
      );
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save product details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Product Info */}
        <div className="lg:col-span-2 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h3 className="text-sm font-bold text-foreground">Basic Product Information</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Product Title <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Premium Wireless Noise-Canceling Headphones"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed product features, specifications, and overview..."
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="beauty">Beauty</option>
                <option value="fragrances">Fragrances</option>
                <option value="furniture">Furniture</option>
                <option value="groceries">Groceries</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sony, Essence, Apple"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h3 className="text-sm font-bold text-foreground">Pricing & Stock</h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Regular Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discount (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as ProductAvailability)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Initial Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Product Media */}
          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
            <h3 className="text-sm font-bold text-foreground">Image URL</h3>
            <div className="space-y-1.5">
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {thumbnail && (
              <div className="relative h-32 w-full rounded-xl border border-border bg-muted overflow-hidden">
                <Image
                  src={thumbnail}
                  alt="Product Image Preview"
                  fill
                  className="object-contain p-2"
                  sizes="300px"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Cancel</span>
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Saving Product...' : isEditing ? 'Save Product Changes' : 'Create Product'}</span>
        </button>
      </div>
    </form>
  );
}

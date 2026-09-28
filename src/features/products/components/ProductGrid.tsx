'use client';

import type { Product } from '@/types';
import { EmptyState } from './EmptyState';
import { ProductCard } from './ProductCard';
import { ProductErrorState } from './ProductErrorState';
import { ProductGridSkeleton } from './ProductSkeleton';

interface ProductGridProps {
  readonly products?: readonly Product[];
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly errorMessage?: string;
  readonly onRetry?: () => void;
  readonly onResetFilters?: () => void;
}

export function ProductGrid({
  products = [],
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  onResetFilters,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (isError) {
    return <ProductErrorState message={errorMessage} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} priority={idx < 4} />
      ))}
    </div>
  );
}

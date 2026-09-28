'use client';

import { useProductDetail } from '../hooks/use-product-detail';
import { ProductBreadcrumbs } from './ProductBreadcrumbs';
import { ProductDetailError } from './ProductDetailError';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ProductNotFound } from './ProductNotFound';
import { ProductSpecifications } from './ProductSpecifications';
import { RecommendationRail, useTrackProductViewOnMount } from '@/features/recommendations';

interface ProductDetailViewProps {
  readonly productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductDetail(productId);

  // Track product view in personalization history
  useTrackProductViewOnMount(product);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError) {
    if (error?.message?.toLowerCase().includes('not found')) {
      return <ProductNotFound />;
    }
    return <ProductDetailError message={error?.message} onRetry={refetch} />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <ProductBreadcrumbs
        title={product.title}
        categorySlug={product.category}
        categoryName={product.categoryName}
      />

      {/* Main PDP Grid: Gallery | Product Info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </div>

      {/* Description Section */}
      <section aria-labelledby="desc-heading" className="space-y-3 pt-6 border-t border-border">
        <h2 id="desc-heading" className="text-lg font-bold tracking-tight text-foreground">
          Product Description
        </h2>
        <div className="prose prose-sm dark:prose-invert text-muted-foreground leading-relaxed max-w-none">
          <p>{product.description}</p>
        </div>
      </section>

      {/* Technical Specifications */}
      <ProductSpecifications
        specifications={product.specifications}
        brand={product.brand}
        categoryName={product.categoryName}
        category={product.category}
      />

      {/* Recommendation Rails */}
      <div className="pt-8 border-t border-border space-y-8">
        <RecommendationRail
          strategy="frequently_bought_together"
          context={{ productId: product.id }}
          limit={4}
        />
        <RecommendationRail
          strategy="similar_products"
          context={{ productId: product.id, categorySlug: product.category }}
          limit={4}
        />
      </div>
    </div>
  );
}


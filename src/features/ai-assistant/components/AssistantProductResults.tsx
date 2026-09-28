'use client';

import type { Product } from '@/types';
import { AssistantProductCard } from './AssistantProductCard';

interface AssistantProductResultsProps {
  readonly products?: readonly Product[];
  readonly comparisonProducts?: readonly Product[];
}

export function AssistantProductResults({
  products,
  comparisonProducts,
}: AssistantProductResultsProps) {
  if (comparisonProducts && comparisonProducts.length >= 2) {
    const [p1, p2] = comparisonProducts;
    return (
      <div className="my-2 rounded-lg border border-border bg-card p-3 space-y-3 text-xs">
        <h5 className="font-bold text-foreground border-b border-border pb-1.5">
          Side-by-Side Comparison
        </h5>
        <div className="grid grid-cols-2 gap-3 divide-x divide-border">
          <div className="space-y-1 pr-1">
            <span className="font-semibold text-primary line-clamp-1">{p1.title}</span>
            <p className="text-muted-foreground">${p1.discountedPrice.toFixed(2)}</p>
            <p className="text-muted-foreground">{p1.rating}★ ({p1.reviewCount} reviews)</p>
            <p className="capitalize text-muted-foreground">{p1.brand}</p>
          </div>

          <div className="space-y-1 pl-3">
            <span className="font-semibold text-primary line-clamp-1">{p2.title}</span>
            <p className="text-muted-foreground">${p2.discountedPrice.toFixed(2)}</p>
            <p className="text-muted-foreground">{p2.rating}★ ({p2.reviewCount} reviews)</p>
            <p className="capitalize text-muted-foreground">{p2.brand}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="my-2 space-y-2">
      {products.map((product, index) => (
        <AssistantProductCard
          key={`ast_prod_${product.id}_${index}`}
          product={product}
          index={index}
        />
      ))}
    </div>
  );
}

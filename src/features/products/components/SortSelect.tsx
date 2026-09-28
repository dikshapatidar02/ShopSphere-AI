'use client';

import { ArrowUpDown } from 'lucide-react';
import type { ProductSortOption } from '../types/discovery-query';

interface SortSelectProps {
  readonly value?: ProductSortOption;
  readonly onChange: (sort: ProductSortOption) => void;
}

export function SortSelect({ value = 'relevance', onChange }: SortSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
        <ArrowUpDown className="h-3.5 w-3.5" />
        <span>Sort by:</span>
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSortOption)}
        className="rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring shadow-xs cursor-pointer"
      >
        <option value="relevance">Relevance</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating_desc">Rating: High to Low</option>
        <option value="name_asc">Name: A to Z</option>
        <option value="name_desc">Name: Z to A</option>
      </select>
    </div>
  );
}

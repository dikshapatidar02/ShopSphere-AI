'use client';

import { X } from 'lucide-react';
import type { ProductDiscoveryQuery } from '../types/discovery-query';

interface ActiveFilterPillsProps {
  readonly query: ProductDiscoveryQuery;
  readonly onRemoveFilter: (key: keyof ProductDiscoveryQuery) => void;
  readonly onClearAll: () => void;
}

export function ActiveFilterPills({
  query,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterPillsProps) {
  const pills: Array<{ key: keyof ProductDiscoveryQuery; label: string }> = [];

  if (query.q) {
    pills.push({ key: 'q', label: `Search: "${query.q}"` });
  }

  if (query.category && query.category !== 'all') {
    pills.push({ key: 'category', label: `Category: ${query.category}` });
  }

  if (typeof query.minPrice === 'number' && typeof query.maxPrice === 'number') {
    pills.push({ key: 'minPrice', label: `$${query.minPrice} - $${query.maxPrice}` });
  } else if (typeof query.minPrice === 'number') {
    pills.push({ key: 'minPrice', label: `Min: $${query.minPrice}` });
  } else if (typeof query.maxPrice === 'number') {
    pills.push({ key: 'maxPrice', label: `Max: $${query.maxPrice}` });
  }

  if (typeof query.minRating === 'number') {
    pills.push({ key: 'minRating', label: `Rating: ${query.minRating}★+` });
  }

  if (query.brand) {
    pills.push({ key: 'brand', label: `Brand: ${query.brand}` });
  }

  if (query.availability && query.availability !== 'all') {
    const label = query.availability === 'in_stock' ? 'In Stock Only' : 'Out of Stock';
    pills.push({ key: 'availability', label: `Status: ${label}` });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs text-muted-foreground font-medium">Active Filters:</span>
      {pills.map((pill) => (
        <span
          key={pill.key}
          className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
        >
          <span>{pill.label}</span>
          <button
            onClick={() => onRemoveFilter(pill.key)}
            aria-label={`Remove filter ${pill.label}`}
            className="rounded-full p-0.5 hover:bg-primary/10 focus:outline-none"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-muted-foreground underline hover:text-foreground focus:outline-none"
      >
        Clear All
      </button>
    </div>
  );
}

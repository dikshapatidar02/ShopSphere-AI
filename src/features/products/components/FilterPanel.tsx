'use client';

import { Filter, RotateCcw, Star, X } from 'lucide-react';
import { useState } from 'react';
import type { ProductDiscoveryQuery } from '../types/discovery-query';
import { validatePriceRange } from '../utils/query-serializer';

interface FilterPanelProps {
  readonly query: ProductDiscoveryQuery;
  readonly availableBrands?: readonly { name: string; count: number }[];
  readonly availableCategories?: readonly { slug: string; name: string; count: number }[];
  readonly onQueryChange: (updated: Partial<ProductDiscoveryQuery>) => void;
  readonly onResetAll: () => void;
  readonly isMobileOpen?: boolean;
  readonly onCloseMobile?: () => void;
}

export function FilterPanel({
  query,
  availableBrands = [],
  availableCategories = [],
  onQueryChange,
  onResetAll,
  isMobileOpen = false,
  onCloseMobile,
}: FilterPanelProps) {
  const [minPriceInput, setMinPriceInput] = useState<string>(
    query.minPrice !== undefined ? String(query.minPrice) : ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    query.maxPrice !== undefined ? String(query.maxPrice) : ''
  );
  const [prevMinPrice, setPrevMinPrice] = useState(query.minPrice);
  const [prevMaxPrice, setPrevMaxPrice] = useState(query.maxPrice);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Sync prop changes during render
  if (query.minPrice !== prevMinPrice || query.maxPrice !== prevMaxPrice) {
    setPrevMinPrice(query.minPrice);
    setPrevMaxPrice(query.maxPrice);
    setMinPriceInput(query.minPrice !== undefined ? String(query.minPrice) : '');
    setMaxPriceInput(query.maxPrice !== undefined ? String(query.maxPrice) : '');
  }

  const handlePriceApply = () => {
    const parsedMin = minPriceInput ? Number(minPriceInput) : undefined;
    const parsedMax = maxPriceInput ? Number(maxPriceInput) : undefined;

    const validation = validatePriceRange(parsedMin, parsedMax);
    if (!validation.isValid) {
      setPriceError(validation.error || 'Invalid price range');
      return;
    }

    setPriceError(null);
    onQueryChange({
      minPrice: parsedMin,
      maxPrice: parsedMax,
      page: 1,
    });
  };

  const hasActiveFilters =
    Boolean(query.category) ||
    typeof query.minPrice === 'number' ||
    typeof query.maxPrice === 'number' ||
    typeof query.minRating === 'number' ||
    Boolean(query.brand) ||
    (query.availability && query.availability !== 'all');

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetAll}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline focus:outline-none"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Category
          </label>
          <select
            value={query.category || ''}
            onChange={(e) =>
              onQueryChange({ category: e.target.value || undefined, page: 1 })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-medium focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Price Range ($)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => {
              setMinPriceInput(e.target.value);
              setPriceError(null);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => {
              setMaxPriceInput(e.target.value);
              setPriceError(null);
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        {priceError && <p className="text-[11px] text-rose-600 font-medium leading-tight">{priceError}</p>}
        <button
          onClick={handlePriceApply}
          className="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white py-1.5 text-xs font-bold focus:outline-none transition-colors"
        >
          Apply Price
        </button>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((stars) => {
            const isSelected = query.minRating === stars;
            return (
              <button
                key={`rating-${stars}`}
                onClick={() =>
                  onQueryChange({
                    minRating: isSelected ? undefined : stars,
                    page: 1,
                  })
                }
                className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors focus:outline-none ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{stars} Stars & Above</span>
                </div>
                {isSelected && <span className="text-xs font-bold text-blue-700">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
            Brand
          </label>
          <select
            value={query.brand || ''}
            onChange={(e) =>
              onQueryChange({ brand: e.target.value || undefined, page: 1 })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-medium focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="">All Brands</option>
            {availableBrands.map((b) => (
              <option key={b.name} value={b.name}>
                {b.name} ({b.count})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Availability Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Availability
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'in_stock', 'out_of_stock'] as const).map((opt) => {
            const isSelected = (query.availability || 'all') === opt;
            const labelMap = {
              all: 'All Statuses',
              in_stock: 'In Stock Only',
              out_of_stock: 'Out of Stock',
            };
            return (
              <button
                key={opt}
                onClick={() => onQueryChange({ availability: opt, page: 1 })}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors focus:outline-none ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {labelMap[opt]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <aside className="hidden lg:block w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-5 shadow-xs h-fit">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/50 backdrop-blur-xs">
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-xl border-l border-slate-200">
            <button
              onClick={onCloseMobile}
              className="absolute right-4 top-4 p-1 rounded-full text-slate-500 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}

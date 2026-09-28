'use client';

import { Search, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

interface ProductManagementFiltersProps {
  readonly query: string;
  readonly onQueryChange: (q: string) => void;
  readonly category: string;
  readonly onCategoryChange: (c: string) => void;
  readonly stockFilter: string;
  readonly onStockFilterChange: (s: string) => void;
  readonly sortBy: 'title' | 'price_asc' | 'price_desc' | 'stock';
  readonly onSortByChange: (s: 'title' | 'price_asc' | 'price_desc' | 'stock') => void;
  readonly categories?: readonly string[];
}

export function ProductManagementFilters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  stockFilter,
  onStockFilterChange,
  sortBy,
  onSortByChange,
  categories = ['beauty', 'fragrances', 'furniture', 'groceries'],
}: ProductManagementFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-2xl border border-border shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search products by title, brand..."
            className="w-full rounded-xl border border-input bg-background pl-9 pr-4 py-2 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground hidden sm:inline" />
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <select
          value={stockFilter}
          onChange={(e) => onStockFilterChange(e.target.value)}
          className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="all">All Stock States</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock (≤5)</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) =>
            onSortByChange(e.target.value as 'title' | 'price_asc' | 'price_desc' | 'stock')
          }
          className="rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="title">Sort by Title</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock">Sort by Stock</option>
        </select>
      </div>

      <Link
        href="/admin/products/new"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs shrink-0"
      >
        <Plus className="h-4 w-4" />
        <span>Add Product</span>
      </Link>
    </div>
  );
}

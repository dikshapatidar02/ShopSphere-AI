'use client';

import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { SlidersHorizontal } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useProductDiscovery } from '../hooks/use-product-discovery';
import type { ProductDiscoveryQuery, ProductSortOption } from '../types/discovery-query';
import { parseDiscoveryQuery, serializeDiscoveryQuery } from '../utils/query-serializer';
import { ActiveFilterPills } from './ActiveFilterPills';
import { CategoryFilterNav } from './CategoryFilterNav';
import { FilterPanel } from './FilterPanel';
import { Pagination } from './Pagination';
import { ProductGrid } from './ProductGrid';
import { SearchBar } from './SearchBar';
import { SortSelect } from './SortSelect';
import { RecommendationRail, usePersonalizationTracker } from '@/features/recommendations';

export function ProductDiscoveryView() {
  const { trackSearchQuery } = usePersonalizationTracker();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Parse current URL params into typed query
  const queryState = useMemo(
    () => parseDiscoveryQuery(searchParams),
    [searchParams]
  );

  // 2. URL query update helper
  const updateQuery = useCallback(
    (updates: Partial<ProductDiscoveryQuery>) => {
      const nextQuery: ProductDiscoveryQuery = {
        ...queryState,
        ...updates,
      };

      const queryString = serializeDiscoveryQuery(nextQuery);
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [pathname, queryState, router]
  );

  // 3. Local state for live search input
  const [searchInput, setSearchInput] = useState<string>(queryState.q || '');
  const [prevQueryQ, setPrevQueryQ] = useState<string | undefined>(queryState.q);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  // Sync external URL change to search input state during render
  if (queryState.q !== prevQueryQ) {
    setPrevQueryQ(queryState.q);
    setSearchInput(queryState.q || '');
  }

  // Sync debounced search value to URL query & record signal
  useEffect(() => {
    const currentQ = queryState.q || '';
    if (debouncedSearch !== currentQ) {
      if (debouncedSearch && debouncedSearch.trim().length > 0) {
        trackSearchQuery(debouncedSearch, queryState.category);
      }
      updateQuery({ q: debouncedSearch || undefined, page: 1 });
    }
  }, [debouncedSearch, queryState.category, queryState.q, trackSearchQuery, updateQuery]);

  // 4. Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 5. Fetch data via TanStack Query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductDiscovery(queryState);

  const handleResetAll = () => {
    setSearchInput('');
    router.push(pathname, { scroll: false });
  };

  const handleRemoveSingleFilter = (key: keyof ProductDiscoveryQuery) => {
    if (key === 'q') setSearchInput('');
    updateQuery({ [key]: undefined, page: 1 });
  };

  const products = data?.products || [];
  const metadata = data?.metadata;

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Product Catalog
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm mt-0.5">
            Discover intelligent e-commerce products with instant filtering and search.
          </p>
        </div>
        <div className="w-full sm:max-w-xs">
          <SearchBar
            initialQuery={searchInput}
            onSearchChange={setSearchInput}
          />
        </div>
      </div>

      {/* Category Pills Navigation */}
      <CategoryFilterNav
        selectedCategory={queryState.category}
        onSelectCategory={(category) => updateQuery({ category, page: 1 })}
      />

      {/* Controls Bar (Mobile Filter Toggle, Result Count, Sort Select) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex lg:hidden items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-muted-foreground font-medium">
            {isLoading
              ? 'Loading results...'
              : `Showing ${products.length} of ${metadata?.total || 0} products`}
          </span>
        </div>

        <SortSelect
          value={queryState.sort}
          onChange={(sort: ProductSortOption) => updateQuery({ sort })}
        />
      </div>

      {/* Active Filter Pills */}
      <ActiveFilterPills
        query={queryState}
        onRemoveFilter={handleRemoveSingleFilter}
        onClearAll={handleResetAll}
      />

      {/* Main Layout: Sidebar Filter + Product Grid */}
      <div className="flex gap-8 items-start">
        <FilterPanel
          query={queryState}
          availableBrands={metadata?.availableBrands}
          availableCategories={metadata?.availableCategories}
          onQueryChange={updateQuery}
          onResetAll={handleResetAll}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        <div className="flex-1 w-full min-w-0">
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            errorMessage={error?.message}
            onRetry={refetch}
            onResetFilters={handleResetAll}
          />

          <Pagination
            currentPage={metadata?.page || 1}
            totalPages={metadata?.totalPages || 1}
            onPageChange={(page) => updateQuery({ page })}
          />
        </div>
      </div>

      {/* Recommendation Rails */}
      <div className="pt-8 border-t border-border/60 space-y-8">
        <RecommendationRail strategy="personalized_for_you" limit={4} />
        <RecommendationRail strategy="trending" limit={4} />
      </div>
    </div>
  );
}


'use client';

import { RecommendationRail, usePersonalizationTracker } from '@/features/recommendations';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { ArrowRight, Bot, ShieldCheck, SlidersHorizontal, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';
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

  const isDefaultView = !queryState.q && !queryState.category && !queryState.brand && !queryState.minPrice && !queryState.maxPrice;

  return (
    <div className="space-y-10">
      {/* Hero Campaign Showcase (Shown on Default Unfiltered Home Page) */}
      {isDefaultView && (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 text-slate-900 p-8 sm:p-12 lg:p-14 border border-slate-200 shadow-xs">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/80 border border-blue-200 px-3.5 py-1 text-xs font-bold text-blue-700 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Next-Gen E-Commerce Catalog</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Intelligent Tech & Lifestyle Catalog.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-xl">
                Experience personalized recommendations, real-time catalog search, and conversational shopping assistance built for the modern Web.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="h-11 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm inline-flex items-center gap-2 shadow-xs transition-all"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#ai-assistant-trigger"
                  onClick={(e) => {
                    e.preventDefault();
                    const triggerBtn = document.querySelector('[aria-label="Open AI Assistant"]') as HTMLButtonElement;
                    if (triggerBtn) triggerBtn.click();
                  }}
                  className="h-11 px-5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm inline-flex items-center gap-2 shadow-xs transition-all"
                >
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span>Ask AI Assistant</span>
                </a>
              </div>

              {/* Service Badges */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Standard Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Product Catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>AI Assisted</span>
                </div>
              </div>
            </div>

            {/* Hero Right Feature Card Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-extrabold text-sm">
                  9+
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Smart Recommendation Engines</h3>
                <p className="text-xs text-slate-600 leading-snug font-medium">Personalized candidate scoring based on signals & cart metrics.</p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs">
                <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-extrabold text-sm">
                  100%
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Strict Type Safety</h3>
                <p className="text-xs text-slate-600 leading-snug font-medium">Built with TypeScript schemas & deterministic data mappers.</p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2 shadow-xs col-span-2 flex items-center gap-4">
                <div className="h-11 w-11 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex-shrink-0 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Enterprise Performance & Security</h3>
                  <p className="text-xs text-slate-600 leading-snug font-medium">WCAG 2.2 AA accessibility, zero committed secrets & 0 lint errors.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalog Header & Search Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {isDefaultView ? 'Featured Catalog' : 'Catalog Search & Filter'}
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm mt-0.5 font-medium">
            Browse our curated collection of high-performance products and accessories.
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
            className="inline-flex lg:hidden items-center gap-1.5 rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-bold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-muted-foreground font-semibold">
            {isLoading
              ? 'Loading catalog...'
              : `Showing ${products.length} of ${metadata?.total || 0} items`}
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

      {/* Contextual Recommendation Rails */}
      <div className="pt-10 border-t border-border/80 space-y-12">
        <RecommendationRail strategy="personalized_for_you" limit={4} />
        <RecommendationRail strategy="trending" limit={4} />
      </div>
    </div>
  );
}

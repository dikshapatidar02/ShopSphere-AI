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
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-400 tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen E-Commerce Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                Intelligent Tech & Lifestyle Catalog.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                Experience personalized recommendations, real-time catalog search, and 24/7 conversational shopping assistance built for the modern Web.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
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
                  className="h-12 px-6 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-sm inline-flex items-center gap-2 transition-all"
                >
                  <Bot className="h-4 w-4 text-blue-400" />
                  <span>Ask AI Assistant</span>
                </a>
              </div>

              {/* Service Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-400" />
                  <span>Express Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verified Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>AI Powered</span>
                </div>
              </div>
            </div>

            {/* Hero Right Feature Card Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
                <div className="h-10 w-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg">
                  9+
                </div>
                <h3 className="font-bold text-white text-sm">Smart Recommendation Engines</h3>
                <p className="text-xs text-slate-400 leading-snug">Personalized candidate scoring based on signals & cart metrics.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg">
                <div className="h-10 w-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
                  100%
                </div>
                <h3 className="font-bold text-white text-sm">Strict Type Safety</h3>
                <p className="text-xs text-slate-400 leading-snug">Built with TypeScript schemas & deterministic data mappers.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg col-span-2 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex-shrink-0 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Enterprise Performance & Security</h3>
                  <p className="text-xs text-slate-400 leading-snug">WCAG 2.2 AA accessibility, zero committed secrets & 0 lint errors.</p>
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

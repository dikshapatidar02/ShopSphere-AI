'use client';

import { useEffect } from 'react';
import type { Product } from '@/types';
import { personalizationSignalTracker } from '@/services/recommendations';

/**
 * Hook to automatically record product views and search signals into user personalization state.
 */
export function usePersonalizationTracker() {
  const trackProductView = (product: Product) => {
    if (!product || !product.id) return;
    personalizationSignalTracker.recordProductView(product);
  };

  const trackSearchQuery = (query: string, category?: string) => {
    if (!query || query.trim().length === 0) return;
    personalizationSignalTracker.recordSearchQuery(query, category);
  };

  return {
    trackProductView,
    trackSearchQuery,
  };
}

/**
 * Component-level helper hook that auto-tracks product view when PDP mounts.
 */
export function useTrackProductViewOnMount(product?: Product | null) {
  useEffect(() => {
    if (product && product.id) {
      personalizationSignalTracker.recordProductView(product);
    }
  }, [product]);
}

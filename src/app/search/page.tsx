import { ProductDiscoveryView } from '@/features/products/components/ProductDiscoveryView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Search Products — ShopSphere AI',
  description: 'Search catalog products, categories, and brands on ShopSphere AI.',
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading search...</div>}>
        <ProductDiscoveryView />
      </Suspense>
    </div>
  );
}

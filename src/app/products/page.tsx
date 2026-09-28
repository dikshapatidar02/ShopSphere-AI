import { ProductDiscoveryView } from '@/features/products/components/ProductDiscoveryView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Shop Products — ShopSphere AI',
  description: 'Explore and search intelligent e-commerce products with advanced filtering and sorting.',
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading catalog...</div>}>
        <ProductDiscoveryView />
      </Suspense>
    </div>
  );
}

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ProductDiscoveryView } from '@/features/products/components/ProductDiscoveryView';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'ShopSphere AI — Intelligent E-Commerce Storefront',
  description: 'Discover intelligent e-commerce products with advanced search, filtering, and modern design.',
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main id="main-content" className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Loading storefront...</div>}>
          <ProductDiscoveryView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

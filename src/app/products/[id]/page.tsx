import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ProductDetailView } from '@/features/products/components/ProductDetailView';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product details — ShopSphere AI`,
    description: `Inspect product #${id} details, pricing, availability, and specifications on ShopSphere AI.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailView productId={id} />
      </main>
      <Footer />
    </div>
  );
}

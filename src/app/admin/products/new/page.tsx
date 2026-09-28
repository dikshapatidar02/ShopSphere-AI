'use client';

import { useAdminProducts, ProductForm } from '@/features/admin';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { Product } from '@/types';

export default function AddProductPage() {
  const router = useRouter();
  const { createProduct, isCreating } = useAdminProducts();

  const handleSubmit = async (values: Omit<Product, 'id'> | Partial<Product>) => {
    const res = await createProduct(values as Omit<Product, 'id'>);
    if (res.success) {
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Product List</span>
        </Link>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Add New Catalog Product
        </h1>
        <p className="text-xs text-muted-foreground">
          Enter validated product information to publish a new item to the store catalog.
        </p>
      </div>

      <ProductForm isLoading={isCreating} onSubmit={handleSubmit} />
    </div>
  );
}

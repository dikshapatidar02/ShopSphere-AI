'use client';

import {
  useAdminProducts,
  ProductForm,
  AdminLoadingState,
  AdminErrorState,
} from '@/features/admin';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/features/admin/services/admin.service';

import type { Product } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = String(params.id);

  const { updateProduct, isUpdating } = useAdminProducts();

  const productQuery = useQuery({
    queryKey: ['admin', 'product', productId],
    queryFn: async () => {
      const res = await adminService.getProductById(productId);
      if (!res.success) {
        throw new Error(res.error.message || `Product '${productId}' not found`);
      }
      return res.data;
    },
  });

  const handleSubmit = async (values: Partial<Product>) => {
    const res = await updateProduct({ id: productId, updates: values });
    if (res.success) {
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    }
  };

  if (productQuery.isLoading) return <AdminLoadingState />;
  if (productQuery.isError || !productQuery.data)
    return <AdminErrorState message={`Failed to load product '${productId}'.`} onRetry={productQuery.refetch} />;

  const product = productQuery.data;

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
          Edit Product — {product.title}
        </h1>
        <p className="text-xs text-muted-foreground">
          Modify title, category, price, discount, inventory stock, or image URL.
        </p>
      </div>

      <ProductForm
        initialValues={product}
        isEditing
        isLoading={isUpdating}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

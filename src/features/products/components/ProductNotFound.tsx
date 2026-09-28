'use client';

import { ArrowLeft, PackageX } from 'lucide-react';
import Link from 'next/link';

export function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center my-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <PackageX className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Product Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        The product you are looking for does not exist or may have been removed from the catalog.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Browse All Products</span>
      </Link>
    </div>
  );
}

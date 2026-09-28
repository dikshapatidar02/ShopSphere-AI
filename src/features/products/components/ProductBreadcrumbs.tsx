'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

interface ProductBreadcrumbsProps {
  readonly title?: string;
  readonly categorySlug?: string;
  readonly categoryName?: string;
}

export function ProductBreadcrumbs({
  title,
  categorySlug,
  categoryName,
}: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="inline-flex items-center gap-1">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>

        <li className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        </li>

        <li>
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Products
          </Link>
        </li>

        {categorySlug && (
          <>
            <li className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            </li>
            <li>
              <Link
                href={`/products?category=${encodeURIComponent(categorySlug)}`}
                className="hover:text-foreground transition-colors capitalize"
              >
                {categoryName || categorySlug}
              </Link>
            </li>
          </>
        )}

        {title && (
          <>
            <li className="flex items-center">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            </li>
            <li className="font-medium text-foreground truncate max-w-[200px] sm:max-w-xs" aria-current="page">
              {title}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}

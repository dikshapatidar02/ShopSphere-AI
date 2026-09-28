'use client';

import { Product } from '@/types';
import { Edit2, Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AdminTable } from './AdminTable';
import { ProductInventoryBadge } from './ProductInventoryBadge';

interface ProductManagementTableProps {
  readonly products: readonly Product[];
  readonly onDeleteClick: (product: Product) => void;
  readonly onInventoryUpdate: (id: string, newStock: number) => Promise<unknown>;
}

export function ProductManagementTable({
  products,
  onDeleteClick,
  onInventoryUpdate,
}: ProductManagementTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStockSubmit = async (productId: string, currentStock: number, inputVal: string) => {
    const parsed = parseInt(inputVal, 10);
    if (isNaN(parsed) || parsed < 0 || parsed === currentStock) return;
    setUpdatingId(productId);
    try {
      await onInventoryUpdate(productId, parsed);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminTable>
      <thead className="bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
        <tr>
          <th className="px-4 py-3.5">Product</th>
          <th className="px-4 py-3.5">Category</th>
          <th className="px-4 py-3.5">Brand</th>
          <th className="px-4 py-3.5">Price</th>
          <th className="px-4 py-3.5">Stock & Status</th>
          <th className="px-4 py-3.5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-muted/30 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl border border-border bg-card overflow-hidden shrink-0">
                  <Image
                    src={product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <span className="text-[11px] text-muted-foreground">ID: {product.id}</span>
                </div>
              </div>
            </td>

            <td className="px-4 py-3 capitalize text-xs text-muted-foreground">
              {product.category}
            </td>

            <td className="px-4 py-3 text-xs text-muted-foreground">
              {product.brand || 'ShopSphere'}
            </td>

            <td className="px-4 py-3">
              <div className="flex flex-col">
                <span className="font-bold text-foreground text-xs">
                  ${product.discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-[10px] text-muted-foreground line-through">
                    ${product.price.toFixed(2)} (-{Math.round(product.discountPercentage)}%)
                  </span>
                )}
              </div>
            </td>

            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <ProductInventoryBadge stock={product.stock} availability={product.availability} />
                <input
                  type="number"
                  min="0"
                  defaultValue={product.stock}
                  disabled={updatingId === product.id}
                  onBlur={(e) => handleStockSubmit(product.id, product.stock, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleStockSubmit(product.id, product.stock, (e.target as HTMLInputElement).value);
                    }
                  }}
                  title="Click to update stock directly"
                  className="w-14 rounded-lg border border-input bg-background px-1.5 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                />
              </div>
            </td>

            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/products/${product.id}`}
                  target="_blank"
                  title="View Storefront PDP"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  href={`/admin/products/${product.id}`}
                  title="Edit Product"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onDeleteClick(product)}
                  title="Delete Product"
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  );
}

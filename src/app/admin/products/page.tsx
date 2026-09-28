'use client';

import {
  useAdminProducts,
  ProductManagementFilters,
  ProductManagementTable,
  ProductDeleteDialog,
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
} from '@/features/admin';
import { Product } from '@/types';
import { useState } from 'react';

export default function AdminProductsPage() {
  const {
    products,
    isLoading,
    isError,
    refetch,
    query,
    setQuery,
    category,
    setCategory,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy,
    deleteProduct,
    isDeleting,
    updateInventory,
  } = useAdminProducts();

  const [selectedForDelete, setSelectedForDelete] = useState<Product | null>(null);

  const handleDeleteConfirm = async () => {
    if (!selectedForDelete) return;
    try {
      await deleteProduct(selectedForDelete.id);
    } finally {
      setSelectedForDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Product Catalog & Inventory
        </h1>
        <p className="text-xs text-muted-foreground">
          Search, filter, edit, update stock, or add products to the simulated catalog.
        </p>
      </div>

      <ProductManagementFilters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      {isLoading && <AdminLoadingState />}

      {isError && (
        <AdminErrorState message="Failed to load product management list." onRetry={refetch} />
      )}

      {!isLoading && !isError && products.length === 0 && (
        <AdminEmptyState
          title="No Products Found"
          description="No catalog items match your search or filter options."
          actionLabel="Add New Product"
          actionHref="/admin/products/new"
        />
      )}

      {!isLoading && !isError && products.length > 0 && (
        <ProductManagementTable
          products={products}
          onDeleteClick={(prod) => setSelectedForDelete(prod)}
          onInventoryUpdate={updateInventory}
        />
      )}

      <ProductDeleteDialog
        isOpen={Boolean(selectedForDelete)}
        productTitle={selectedForDelete?.title || ''}
        isDeleting={isDeleting}
        onClose={() => setSelectedForDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

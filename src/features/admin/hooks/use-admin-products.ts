'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { adminService } from '../services/admin.service';
import type { Product } from '@/types';

export function useAdminProducts() {
  const queryClient = useQueryClient();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'price_asc' | 'price_desc' | 'stock'>('title');

  const productsQuery = useQuery({
    queryKey: ['admin', 'products', query, category, stockFilter],
    queryFn: async () => {
      const res = await adminService.getProducts({ query, category, stock: stockFilter });
      if (!res.success) {
        throw new Error(res.error.message || 'Failed to fetch admin products');
      }
      return res.data.products;
    },
  });

  const invalidateProductQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, 'id'>) => adminService.createProduct(newProduct),
    onSuccess: (res) => {
      if (res.success) {
        invalidateProductQueries();
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      adminService.updateProduct(id, updates),
    onSuccess: (res, variables) => {
      if (res.success) {
        invalidateProductQueries();
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: (res) => {
      if (res.success) {
        invalidateProductQueries();
      }
    },
  });

  const inventoryMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      adminService.updateInventory(id, stock),
    onSuccess: (res, variables) => {
      if (res.success) {
        invalidateProductQueries();
        queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      }
    },
  });

  const rawProducts = productsQuery.data || [];
  const sortedProducts = [...rawProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.discountedPrice - b.discountedPrice;
    if (sortBy === 'price_desc') return b.discountedPrice - a.discountedPrice;
    if (sortBy === 'stock') return a.stock - b.stock;
    return a.title.localeCompare(b.title);
  });

  const handleUpdateInventory = useCallback(
    (id: string, stock: number) => inventoryMutation.mutateAsync({ id, stock }),
    [inventoryMutation]
  );

  return {
    products: sortedProducts,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    refetch: productsQuery.refetch,
    query,
    setQuery,
    category,
    setCategory,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy,
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    updateInventory: handleUpdateInventory,
    isUpdatingInventory: inventoryMutation.isPending,
  };
}

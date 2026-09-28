'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { adminService } from '../services/admin.service';
import type { OrderStatus } from '@/types';

export function useAdminOrders() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders', searchQuery, statusFilter],
    queryFn: async () => {
      const res = await adminService.getAllOrders({ query: searchQuery, status: statusFilter });
      if (!res.success) {
        throw new Error(res.error.message || 'Failed to fetch admin orders');
      }
      return res.data;
    },
  });

  const invalidateOrderQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['account-orders'] });
  }, [queryClient]);

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      adminService.updateOrderStatus(orderId, status),
    onSuccess: (res, variables) => {
      if (res.success) {
        invalidateOrderQueries();
        queryClient.invalidateQueries({ queryKey: ['admin', 'order', variables.orderId] });
      }
    },
  });

  const handleUpdateStatus = useCallback(
    (orderId: string, status: OrderStatus) => updateStatusMutation.mutateAsync({ orderId, status }),
    [updateStatusMutation]
  );

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus: handleUpdateStatus,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}

export function useAdminOrderDetails(orderId: string) {
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: async () => {
      const res = await adminService.getOrderById(orderId);
      if (!res.success) {
        throw new Error(res.error.message || `Order '${orderId}' not found`);
      }
      return res.data;
    },
    enabled: Boolean(orderId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: OrderStatus) => adminService.updateOrderStatus(orderId, newStatus),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['admin'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] });
      }
    },
  });

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    error: orderQuery.error,
    refetch: orderQuery.refetch,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}

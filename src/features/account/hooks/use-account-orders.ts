'use client';

import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export function useAccountOrders() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['account-orders', userId],
    queryFn: () => accountService.getUserOrders(userId),
    enabled: Boolean(userId),
  });

  return {
    orders,
    isLoading,
    isError,
    refetch,
  };
}

export function useAccountOrderDetails(orderId: string) {
  const { user } = useAuth();
  const userId = user?.id || '';

  const { data: order, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['account-order-details', userId, orderId],
    queryFn: () => accountService.getUserOrderById(userId, orderId),
    enabled: Boolean(userId && orderId),
  });

  return {
    order,
    isLoading,
    isError,
    error,
    refetch,
  };
}

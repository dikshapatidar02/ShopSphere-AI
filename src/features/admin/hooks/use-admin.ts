'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/admin.service';

export function useAdmin() {
  const overviewQuery = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: async () => {
      const res = await adminService.getOverviewMetrics();
      if (!res.success) {
        throw new Error(res.error.message || 'Failed to fetch admin overview metrics');
      }
      return res.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  return {
    metrics: overviewQuery.data,
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,
    error: overviewQuery.error,
    refetch: overviewQuery.refetch,
  };
}

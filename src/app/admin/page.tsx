'use client';

import { useAdmin, SimulatedMetrics, AdminLoadingState, AdminErrorState } from '@/features/admin';

export default function AdminOverviewPage() {
  const { metrics, isLoading, isError, refetch } = useAdmin();

  if (isLoading) return <AdminLoadingState />;
  if (isError || !metrics)
    return <AdminErrorState message="Failed to load admin overview metrics." onRetry={refetch} />;

  return <SimulatedMetrics metrics={metrics} />;
}

'use client';

import {
  useAdminOrderDetails,
  AdminOrderDetails,
  AdminLoadingState,
  AdminErrorState,
} from '@/features/admin';
import { useParams } from 'next/navigation';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const orderId = String(params.id);

  const { order, isLoading, isError, error, refetch, updateStatus, isUpdatingStatus } =
    useAdminOrderDetails(orderId);

  if (isLoading) return <AdminLoadingState />;
  if (isError || !order)
    return (
      <AdminErrorState
        message={error instanceof Error ? error.message : `Order '${orderId}' not found.`}
        onRetry={refetch}
      />
    );

  return (
    <AdminOrderDetails
      order={order}
      isUpdatingStatus={isUpdatingStatus}
      onStatusChange={updateStatus}
    />
  );
}

'use client';

import {
  useAdminOrders,
  OrderFilters,
  OrderManagementTable,
  AdminLoadingState,
  AdminErrorState,
  AdminEmptyState,
} from '@/features/admin';

export default function AdminOrdersPage() {
  const {
    orders,
    isLoading,
    isError,
    refetch,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus,
  } = useAdminOrders();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Order Management
        </h1>
        <p className="text-xs text-muted-foreground">
          View all system orders, track delivery lifecycle, and execute order status transitions.
        </p>
      </div>

      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading && <AdminLoadingState />}

      {isError && (
        <AdminErrorState message="Failed to load order management list." onRetry={refetch} />
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <AdminEmptyState
          title="No Orders Found"
          description="No customer orders match your search or status filter options."
        />
      )}

      {!isLoading && !isError && orders.length > 0 && (
        <OrderManagementTable orders={orders} onStatusChange={updateStatus} />
      )}
    </div>
  );
}

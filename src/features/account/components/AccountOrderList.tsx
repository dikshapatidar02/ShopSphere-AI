'use client';

import { Package } from 'lucide-react';
import { useAccountOrders } from '../hooks/use-account-orders';
import { AccountEmptyState } from './AccountEmptyState';
import { AccountErrorState } from './AccountErrorState';
import { AccountLoadingState } from './AccountLoadingState';
import { AccountOrderCard } from './AccountOrderCard';

export function AccountOrderList() {
  const { orders, isLoading, isError, refetch } = useAccountOrders();

  if (isLoading) return <AccountLoadingState />;
  if (isError) return <AccountErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground">Order History</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Track active orders, view receipts, and review past purchases.
        </p>
      </div>

      {orders.length === 0 ? (
        <AccountEmptyState
          title="No orders found"
          description="You haven't placed any orders yet. Start shopping to view your purchase history."
          actionLabel="Explore Storefront"
          actionHref="/products"
          icon={<Package className="h-6 w-6" />}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <AccountOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

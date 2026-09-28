import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { OrdersView } from '@/features/orders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders | ShopSphere AI',
  description: 'View and track your past order history.',
};

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersView />
    </ProtectedRoute>
  );
}

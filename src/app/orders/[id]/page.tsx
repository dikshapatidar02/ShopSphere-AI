import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { OrderDetailView } from '@/features/orders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Details | ShopSphere AI',
  description: 'View specific order details and tracking status.',
};

interface OrderDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  return (
    <ProtectedRoute>
      <OrderDetailView orderId={id} />
    </ProtectedRoute>
  );
}

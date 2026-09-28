import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { OrderConfirmationView } from '@/features/orders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Placed Successfully | ShopSphere AI',
  description: 'Thank you for your order.',
};

interface OrderSuccessPageProps {
  readonly params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderId } = await params;

  return (
    <ProtectedRoute>
      <OrderConfirmationView orderId={orderId} />
    </ProtectedRoute>
  );
}

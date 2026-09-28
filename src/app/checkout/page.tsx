import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { CheckoutView } from '@/features/checkout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | ShopSphere AI',
  description: 'Complete your order checkout securely.',
};

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutView />
    </ProtectedRoute>
  );
}

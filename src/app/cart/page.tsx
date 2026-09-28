import { CartView } from '@/features/cart';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | ShopSphere AI',
  description: 'View and manage items in your shopping cart.',
};

export default function CartPage() {
  return <CartView />;
}

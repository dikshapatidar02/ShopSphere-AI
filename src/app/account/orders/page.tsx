import { AccountLayout, AccountOrderList } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders — ShopSphere AI',
  description: 'View your past orders, delivery status, and purchase history.',
};

export default function AccountOrdersPage() {
  return (
    <AccountLayout>
      <AccountOrderList />
    </AccountLayout>
  );
}

import { AccountLayout, AddressList } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Addresses — ShopSphere AI',
  description: 'Manage your default shipping addresses and delivery locations.',
};

export default function AccountAddressesPage() {
  return (
    <AccountLayout>
      <AddressList />
    </AccountLayout>
  );
}

import { AccountLayout, ProfileOverview } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account Overview — ShopSphere AI',
  description: 'Manage your ShopSphere AI customer profile, order history, addresses, and wishlist.',
};

export default function AccountOverviewPage() {
  return (
    <AccountLayout>
      <ProfileOverview />
    </AccountLayout>
  );
}

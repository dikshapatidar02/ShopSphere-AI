import { AccountLayout, RecentlyViewed } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recently Viewed — ShopSphere AI',
  description: 'View products you recently inspected across your shopping sessions.',
};

export default function AccountRecentlyViewedPage() {
  return (
    <AccountLayout>
      <RecentlyViewed />
    </AccountLayout>
  );
}

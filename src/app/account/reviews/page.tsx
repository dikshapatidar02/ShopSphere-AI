import { AccountLayout, ReviewList } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Reviews — ShopSphere AI',
  description: 'Manage product reviews and ratings submitted for your purchases.',
};

export default function AccountReviewsPage() {
  return (
    <AccountLayout>
      <ReviewList />
    </AccountLayout>
  );
}

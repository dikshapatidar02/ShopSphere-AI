import { AccountLayout, AccountWishlist } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Wishlist — ShopSphere AI',
  description: 'View your saved products and move items to cart.',
};

export default function AccountWishlistPage() {
  return (
    <AccountLayout>
      <AccountWishlist />
    </AccountLayout>
  );
}

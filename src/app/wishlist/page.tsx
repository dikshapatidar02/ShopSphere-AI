import { WishlistView } from '@/features/wishlist';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Wishlist | ShopSphere AI',
  description: 'View and manage products saved in your wishlist.',
};

export default function WishlistPage() {
  return <WishlistView />;
}

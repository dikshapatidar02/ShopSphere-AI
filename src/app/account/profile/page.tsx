import { AccountLayout, ProfileForm } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Settings — ShopSphere AI',
  description: 'View and update your personal account details.',
};

export default function AccountProfilePage() {
  return (
    <AccountLayout>
      <ProfileForm />
    </AccountLayout>
  );
}

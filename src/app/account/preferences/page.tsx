import { AccountLayout, RecommendationPreferences } from '@/features/account';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account Preferences — ShopSphere AI',
  description: 'Manage recommendation preferences and personalization display options.',
};

export default function AccountPreferencesPage() {
  return (
    <AccountLayout>
      <RecommendationPreferences />
    </AccountLayout>
  );
}

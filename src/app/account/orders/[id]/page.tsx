import { AccountLayout, AccountOrderDetails } from '@/features/account';
import type { Metadata } from 'next';

interface PageProps {
  readonly params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id} — ShopSphere AI`,
    description: `Order tracking and details for order #${id}`,
  };
}

export default async function AccountOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AccountLayout>
      <AccountOrderDetails orderId={id} />
    </AccountLayout>
  );
}

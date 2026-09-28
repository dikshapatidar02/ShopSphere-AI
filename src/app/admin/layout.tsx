import { AdminLayout } from '@/features/admin';

export const metadata = {
  title: 'Admin Dashboard | ShopSphere AI',
  description: 'Simulated administrative commerce management portal for ShopSphere AI.',
};

export default function Layout({ children }: { readonly children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

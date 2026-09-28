'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AccountHeader } from './AccountHeader';
import { AccountMobileNav } from './AccountMobileNav';
import { AccountSidebar } from './AccountSidebar';

interface AccountLayoutProps {
  readonly children: React.ReactNode;
}

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <AccountHeader />
          <AccountMobileNav />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <aside className="hidden md:block md:col-span-3 lg:col-span-3 sticky top-20">
              <div className="rounded-2xl border border-border bg-card p-4 shadow-xs">
                <AccountSidebar />
              </div>
            </aside>

            <div className="md:col-span-9 lg:col-span-9 space-y-6 min-w-0">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}

'use client';

import { useAuth } from '@/hooks/use-auth';
import { Lock, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminMobileNav } from './AdminMobileNav';
import { AdminSidebar } from './AdminSidebar';

interface AdminLayoutProps {
  readonly children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isHydrated, user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-3 text-xs text-muted-foreground">Verifying admin session credentials...</span>
      </div>
    );
  }

  // 1. Unauthenticated User State
  if (!isAuthenticated || !user) {
    const handleQuickAdminLogin = async () => {
      setLoading(true);
      await login({
        email: 'admin.sarah@shopsphere.ai',
        password: 'password123',
      });
      setLoading(false);
    };

    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Admin Portal Sign-In
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Access to the ShopSphere AI Administration Dashboard requires an administrator account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Sign In as Sarah Connor (Admin Demo)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Uses pre-configured administrator role credentials</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Customer Attempting to Access Admin
  if (user.role !== 'administrator') {
    const handleSwitchToAdmin = async () => {
      setLoading(true);
      await login({
        email: 'admin.sarah@shopsphere.ai',
        password: 'password123',
      });
      setLoading(false);
    };

    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8 space-y-6 shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Access Denied
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your account (<strong className="text-foreground">{user.email}</strong>) has customer privileges.
              Administrator authorization is required to access <code className="text-primary font-mono text-xs">/admin</code> routes.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleSwitchToAdmin}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Switching Account...</span>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Switch to Admin Account (Sarah Connor)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Administrator State
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AdminHeader />
      <AdminMobileNav />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

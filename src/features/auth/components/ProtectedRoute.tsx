'use client';

import { useAuth } from '@/hooks/use-auth';
import { Lock, Sparkles, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isHydrated, login } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-3 text-xs text-muted-foreground">Checking authentication...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    const handleQuickLogin = async () => {
      setLoading(true);
      await login({
        email: 'alex.johnson@example.com',
        password: 'password123',
      });
      setLoading(false);
    };

    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Sign In Required
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              To view your checkout or manage order history, please sign in with an account.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <UserCheck className="h-4 w-4" />
                  <span>Sign In as Alex Johnson (Demo Account)</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Uses pre-populated mock credentials for instant access</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useAuth } from '@/hooks/use-auth';
import { LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  readonly title?: string;
  readonly description?: string;
}

export function AdminHeader({
  title = 'Admin Dashboard',
  description = 'ShopSphere AI simulated commerce management portal',
}: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border bg-card px-6 py-4 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
            <ShieldCheck className="h-3 w-3" />
            <span>Admin</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 pr-3 border-r border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground leading-tight">{user.name}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{user.email}</span>
            </div>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>

        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

'use client';

import { useAuth } from '@/hooks/use-auth';
import { LogOut, User as UserIcon } from 'lucide-react';

export function AccountHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
      })
    : 'Member';

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold uppercase shrink-0">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              user.name.charAt(0) || <UserIcon className="h-7 w-7" />
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{user.email}</span>
              <span>•</span>
              <span className="capitalize">{user.role}</span>
              <span>•</span>
              <span>Joined {joinedDate}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring transition-colors self-start sm:self-center"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

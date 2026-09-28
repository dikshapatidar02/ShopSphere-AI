'use client';

import { LucideIcon, Inbox } from 'lucide-react';
import Link from 'next/link';

interface AdminEmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly icon?: LucideIcon;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly onAction?: () => void;
}

export function AdminEmptyState({
  title = 'No Data Found',
  description = 'No matching admin records available.',
  icon: Icon = Inbox,
  actionLabel,
  actionHref,
  onAction,
}: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center my-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-md">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

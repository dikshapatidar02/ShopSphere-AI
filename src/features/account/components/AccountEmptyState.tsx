'use client';

import { PackageOpen } from 'lucide-react';
import Link from 'next/link';

interface AccountEmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly actionHref?: string;
  readonly icon?: React.ReactNode;
}

export function AccountEmptyState({
  title,
  description,
  actionLabel = 'Explore Products',
  actionHref = '/products',
  icon,
}: AccountEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-card/40 my-4">
      <div className="mb-3 rounded-full bg-muted p-3 text-muted-foreground">
        {icon || <PackageOpen className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

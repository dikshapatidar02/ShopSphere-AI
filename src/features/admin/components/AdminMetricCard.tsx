'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface AdminMetricCardProps {
  readonly title: string;
  readonly value: string | number;
  readonly icon: LucideIcon;
  readonly trend?: {
    readonly value: string;
    readonly isPositive: boolean;
  };
  readonly description?: string;
  readonly badgeText?: string;
  readonly accentColor?: 'primary' | 'success' | 'warning' | 'info';
}

export function AdminMetricCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  badgeText = 'Simulated',
  accentColor = 'primary',
}: AdminMetricCardProps) {
  const getAccentBg = () => {
    switch (accentColor) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'warning':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'info':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getAccentBg()}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </span>
        {badgeText && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/50">
            {badgeText}
          </span>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          {trend && (
            <span
              className={`flex items-center font-semibold ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="mr-1 h-3.5 w-3.5 inline" />
              ) : (
                <TrendingDown className="mr-1 h-3.5 w-3.5 inline" />
              )}
              {trend.value}
            </span>
          )}
          {description && <span className="truncate">{description}</span>}
        </div>
      )}
    </div>
  );
}

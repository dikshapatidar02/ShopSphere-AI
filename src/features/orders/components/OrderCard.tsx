'use client';

import type { Order } from '@/types';
import { ArrowRight, Calendar, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderCardProps {
  readonly order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';
  const firstItem = order.items[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  return (
    <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card shadow-xs hover:border-foreground/20 transition-all">
      <div className="flex items-center gap-4">
        {/* Preview Thumbnail */}
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted border border-border">
          <Image
            src={firstItem?.productThumbnail || fallbackImage}
            alt={firstItem?.productTitle || 'Order item'}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground font-mono">{order.orderNumber}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${getStatusBadge(order.status)}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
            </span>
          </div>

          <p className="text-muted-foreground line-clamp-1">
            {firstItem?.productTitle}
            {order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
        <div className="text-left sm:text-right">
          <span className="text-xs text-muted-foreground block">Total Paid</span>
          <span className="text-base font-extrabold text-foreground">${order.grandTotal.toFixed(2)}</span>
        </div>

        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          <span>Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

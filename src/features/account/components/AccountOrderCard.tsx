'use client';

import type { Order } from '@/types/order';
import { ArrowRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AccountOrderCardProps {
  readonly order: Order;
}

export function AccountOrderCard({ order }: AccountOrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'placed':
      case 'confirmed':
      case 'packed':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground">Order #{order.id}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${getStatusBadge(
                order.status
              )}`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Placed on {formattedDate}</span>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-sm font-bold text-foreground">
            ${order.grandTotal.toFixed(2)}
          </span>
          <p className="text-[11px] text-muted-foreground">
            {order.items.length} item{order.items.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Items Preview */}
      <div className="py-3 flex items-center gap-3 overflow-x-auto">
        {order.items.slice(0, 4).map((item, idx) => (
          <div
            key={`ord_img_${item.productId}_${idx}`}
            className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted border border-border"
          >
            <Image
              src={item.productThumbnail || '/placeholder.png'}
              alt={item.productTitle}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ))}
        {order.items.length > 4 && (
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted border border-border text-xs font-bold text-muted-foreground">
            +{order.items.length - 4}
          </div>
        )}
      </div>

      <div className="pt-2 flex justify-end">
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>View Details & Tracking</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import { ArrowLeft, Calendar, CheckCircle2, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAccountOrderDetails } from '../hooks/use-account-orders';
import { AccountEmptyState } from './AccountEmptyState';
import { AccountErrorState } from './AccountErrorState';
import { AccountLoadingState } from './AccountLoadingState';

interface AccountOrderDetailsProps {
  readonly orderId: string;
}

export function AccountOrderDetails({ orderId }: AccountOrderDetailsProps) {
  const { order, isLoading, isError, refetch } = useAccountOrderDetails(orderId);

  if (isLoading) return <AccountLoadingState />;
  if (isError) return <AccountErrorState onRetry={refetch} />;

  if (!order) {
    return (
      <AccountEmptyState
        title="Order Not Found"
        description="The requested order does not exist or does not belong to your account."
        actionLabel="Back to Orders"
        actionHref="/account/orders"
        icon={<Package className="h-6 w-6" />}
      />
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const timeline = [
    { status: 'placed', label: 'Order Placed', completed: true },
    { status: 'processing', label: 'Processing', completed: order.status !== 'cancelled' },
    { status: 'shipped', label: 'Shipped', completed: order.status === 'shipped' || order.status === 'delivered' },
    { status: 'delivered', label: 'Delivered', completed: order.status === 'delivered' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Orders</span>
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Order #{order.id}
          </h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Placed on {formattedDate}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary self-start sm:self-center">
          <ShieldCheck className="h-4 w-4" />
          <span className="capitalize">{order.status}</span>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Delivery Status Timeline
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {timeline.map((step) => (
            <div key={step.status} className="flex flex-col items-center text-center space-y-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step.completed
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              </div>
              <span className="text-xs font-semibold text-foreground">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Items Table | Order Summary & Delivery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List Snapshot */}
        <div className="lg:col-span-8 rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
            Items Snapshot ({order.items.length})
          </h3>

          <div className="divide-y divide-border">
            {order.items.map((item, idx) => (
              <div
                key={`ord_item_${item.productId}_${idx}`}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
                  <Image
                    src={item.productThumbnail || '/placeholder.png'}
                    alt={item.productTitle}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">
                    <Link href={`/products/${item.productId}`} className="hover:underline">
                      {item.productTitle}
                    </Link>
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-foreground">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Shipping Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Shipping Address */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Shipping Address</span>
            </h4>
            <div className="text-xs text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground">{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment & Totals */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border pb-2">
              Payment Summary
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-medium text-foreground">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>-${order.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-medium text-foreground">${order.shippingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="font-medium text-foreground">${order.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-sm font-bold text-foreground">
                <span>Total Paid</span>
                <span className="text-primary">${order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

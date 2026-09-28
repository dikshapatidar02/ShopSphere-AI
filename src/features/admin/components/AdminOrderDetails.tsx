'use client';

import { Order, OrderStatus } from '@/types';
import { ArrowLeft, Clock, MapPin, Package, ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { OrderStatusControl } from './OrderStatusControl';

interface AdminOrderDetailsProps {
  readonly order: Order;
  readonly isUpdatingStatus?: boolean;
  readonly onStatusChange: (newStatus: OrderStatus) => Promise<unknown>;
}

export function AdminOrderDetails({
  order,
  isUpdatingStatus = false,
  onStatusChange,
}: AdminOrderDetailsProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-xs">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Order {order.orderNumber}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Placed on {formattedDate}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">
            Status Management:
          </span>
          <OrderStatusControl
            currentStatus={order.status}
            isUpdating={isUpdatingStatus}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items & Historical Snapshots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span>Purchased Items & Historical Snapshots ({order.items.length})</span>
              </h2>
              <span className="text-[11px] text-muted-foreground">Historical Snapshot Preserved</span>
            </div>

            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center gap-4 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 rounded-xl border border-border bg-muted overflow-hidden shrink-0">
                    <Image
                      src={item.productThumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                      alt={item.productTitle}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productId}`}
                      target="_blank"
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.productTitle}
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-foreground">
                      ${item.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount</span>
                  <span>-${order.discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping ({order.deliveryOption.name})</span>
                <span>${order.shippingTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax</span>
                <span>${order.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-sm pt-2 border-t border-border">
                <span>Grand Total</span>
                <span>${order.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Tracking Timeline & Audit Trail</span>
            </h2>

            <div className="relative pl-6 space-y-4 border-l-2 border-border ml-2">
              {order.tracking.events.map((evt) => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-card" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground capitalize">
                      {evt.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(evt.timestamp).toLocaleString()} • {evt.location}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">{evt.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Shipping Address */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>Customer Information</span>
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Customer Name</span>
                <span className="font-semibold text-foreground">{order.customerName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Email Address</span>
                <span className="font-semibold text-foreground">{order.customerEmail}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">User Account ID</span>
                <span className="font-mono text-muted-foreground text-[11px]">{order.userId}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Shipping Destination</span>
            </h2>
            <div className="text-xs text-foreground space-y-1">
              <p className="font-bold">{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Payment Details</span>
            </h2>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-semibold text-foreground capitalize">
                  {order.paymentDetails.method.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                  {order.paymentDetails.status}
                </span>
              </div>
              {order.paymentDetails.transactionId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {order.paymentDetails.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

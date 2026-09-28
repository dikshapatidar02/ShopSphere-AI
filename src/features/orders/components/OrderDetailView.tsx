'use client';

import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/orders/order.service';
import type { Order } from '@/types';
import { ArrowLeft, Calendar, CreditCard, MapPin, Package, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';

interface OrderDetailViewProps {
  readonly orderId: string;
}

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const { user } = useAuth();
  const userId = user?.id || 'user-guest-1';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackImage = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&auto=format&fit=crop&q=80';

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const res = await orderService.getOrderById(orderId, userId);
      if (res.success) {
        setOrder(res.data);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId, userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="mt-3 text-xs text-muted-foreground">Loading order details...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-foreground">Order Access Restricted</h1>
        <p className="text-xs text-muted-foreground">
          {error || 'This order does not exist or does not belong to your account.'}
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Orders</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <Link href="/orders" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Orders</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <span>Order</span>
            <span className="font-mono text-primary">{order.orderNumber}</span>
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status:</span>
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 capitalize">
            {order.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Package Tracking Timeline */}
      <OrderTrackingTimeline tracking={order.tracking} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Historical Items Snapshot */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
            <h2 className="font-bold text-sm text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span>Purchased Items Snapshot ({order.items.length})</span>
            </h2>

            <div className="divide-y divide-border/60">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 rounded-lg bg-muted border border-border overflow-hidden">
                      <Image
                        src={item.productThumbnail || fallbackImage}
                        alt={item.productTitle}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground text-sm hover:text-primary">
                        <Link href={`/products/${item.productId}`}>{item.productTitle}</Link>
                      </h3>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        ${item.unitPrice.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-extrabold text-foreground text-sm shrink-0">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Details & Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-xs shadow-xs">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Shipping Address</span>
            </div>
            <p className="font-semibold text-foreground">{order.shippingAddress.recipientName}</p>
            <p className="text-muted-foreground">{order.shippingAddress.line1}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-muted-foreground">{order.shippingAddress.country}</p>
          </div>

          {/* Delivery & Payment Info */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3 text-xs shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Truck className="h-4 w-4 text-primary" />
                <span>Delivery Method</span>
              </div>
              <p className="text-muted-foreground">{order.deliveryOption.name} ({order.deliveryOption.estimatedDays})</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-border">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CreditCard className="h-4 w-4 text-primary" />
                <span>Payment Information</span>
              </div>
              <p className="text-muted-foreground capitalize">
                Method: {order.paymentDetails.method.replace('mock_', '').replace('_', ' ')}
              </p>
              {order.paymentDetails.transactionId && (
                <p className="text-[11px] text-muted-foreground font-mono">
                  Txn ID: {order.paymentDetails.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2.5 text-xs shadow-xs">
            <h3 className="font-bold text-foreground border-b border-border pb-2">Financial Breakdown</h3>

            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground font-medium">${order.subtotal.toFixed(2)}</span>
            </div>

            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>Discounts</span>
                <span>-${order.discountTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-foreground font-medium">${order.shippingTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span className="text-foreground font-medium">${order.taxTotal.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-border flex justify-between font-extrabold text-foreground text-base">
              <span>Grand Total</span>
              <span className="text-emerald-600 dark:text-emerald-400">${order.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

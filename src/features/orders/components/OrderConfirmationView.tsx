'use client';

import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/orders/order.service';
import type { Order } from '@/types';
import { CheckCircle2, MapPin, Package, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface OrderConfirmationViewProps {
  readonly orderId: string;
}

export function OrderConfirmationView({ orderId }: OrderConfirmationViewProps) {
  const { user } = useAuth();
  const userId = user?.id || 'user-guest-1';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <span className="mt-3 text-xs text-muted-foreground">Loading order confirmation...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-xs text-muted-foreground">{error || 'Could not locate order details.'}</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 sm:p-8 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Order Placed Successfully!
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Thank you for your order!
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Order Number: <strong className="text-foreground font-mono">{order.orderNumber}</strong>
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Truck className="h-4 w-4 text-primary" />
            <span>Delivery Info</span>
          </div>
          <p className="text-muted-foreground font-medium">{order.deliveryOption.name}</p>
          <p className="text-muted-foreground">
            Est. Delivery: <strong>{order.tracking.estimatedDeliveryDate}</strong>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-2 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Shipping Address</span>
          </div>
          <p className="font-semibold text-foreground">{order.shippingAddress.recipientName}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>

      {/* Financial Summary Box */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs text-xs sm:text-sm">
        <h3 className="font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <span>Order Summary</span>
        </h3>

        <div className="space-y-1.5 text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal ({order.items.length} items)</span>
            <span className="text-foreground font-medium">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-foreground font-medium">${order.shippingTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="text-foreground font-medium">${order.taxTotal.toFixed(2)}</span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between font-bold text-foreground text-base">
            <span>Total Paid</span>
            <span className="text-emerald-600 dark:text-emerald-400">${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href={`/orders/${order.id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
        >
          <Package className="h-4 w-4" />
          <span>View Order Details & Track</span>
        </Link>
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-6 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-all"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </main>
  );
}

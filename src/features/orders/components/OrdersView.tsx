'use client';

import { useAuth } from '@/hooks/use-auth';
import { orderService } from '@/services/orders/order.service';
import type { Order } from '@/types';
import { ArrowRight, Package, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OrderCard } from './OrderCard';

export function OrdersView() {
  const { user } = useAuth();
  const userId = user?.id || 'user-guest-1';

  const [orders, setOrders] = useState<readonly Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const res = await orderService.getOrdersByUserId(userId);
      if (res.success && res.data) {
        setOrders(res.data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userId]);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-border pb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
          <Package className="h-7 w-7 text-primary" />
          <span>My Orders</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          View your order history, delivery details, and package tracking.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 w-full animate-pulse rounded-xl bg-muted border border-border" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-6 max-w-md mx-auto">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-xs">
            <Package className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              No Orders Found
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You haven&apos;t placed any orders yet. Start exploring our AI-driven catalog to place your first order!
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Start Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}

'use client';

import { Order, OrderStatus } from '@/types';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { AdminTable } from './AdminTable';
import { OrderStatusControl } from './OrderStatusControl';

interface OrderManagementTableProps {
  readonly orders: readonly Order[];
  readonly onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<unknown>;
}

export function OrderManagementTable({ orders, onStatusChange }: OrderManagementTableProps) {
  return (
    <AdminTable>
      <thead className="bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
        <tr>
          <th className="px-4 py-3.5">Order #</th>
          <th className="px-4 py-3.5">Customer</th>
          <th className="px-4 py-3.5">Date</th>
          <th className="px-4 py-3.5">Items</th>
          <th className="px-4 py-3.5">Total</th>
          <th className="px-4 py-3.5">Status & Action</th>
          <th className="px-4 py-3.5 text-right">Details</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {orders.map((order) => {
          const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

          return (
            <tr key={order.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-bold text-foreground hover:text-primary transition-colors text-xs"
                >
                  {order.orderNumber}
                </Link>
              </td>

              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground text-xs">
                    {order.customerName}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{order.customerEmail}</span>
                </div>
              </td>

              <td className="px-4 py-3 text-xs text-muted-foreground">{dateStr}</td>

              <td className="px-4 py-3 text-xs text-muted-foreground">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </td>

              <td className="px-4 py-3 font-bold text-foreground text-xs">
                ${order.grandTotal.toFixed(2)}
              </td>

              <td className="px-4 py-3">
                <OrderStatusControl
                  currentStatus={order.status}
                  onStatusChange={(newStatus) => onStatusChange(order.id, newStatus)}
                />
              </td>

              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="inline-flex items-center gap-1 rounded-lg p-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">View</span>
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </AdminTable>
  );
}

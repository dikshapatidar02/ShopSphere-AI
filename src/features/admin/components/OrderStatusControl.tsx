'use client';

import { OrderStatus } from '@/types';
import { useState } from 'react';

interface OrderStatusControlProps {
  readonly currentStatus: OrderStatus;
  readonly isUpdating?: boolean;
  readonly onStatusChange: (newStatus: OrderStatus) => Promise<unknown>;
}

export function OrderStatusControl({
  currentStatus,
  isUpdating = false,
  onStatusChange,
}: OrderStatusControlProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  const getBadgeStyle = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'confirmed':
      case 'packed':
        return 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20';
      case 'cancelled':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
    }
  };

  const handleSelect = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return;
    setSelectedStatus(newStatus);
    setSaving(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${getBadgeStyle(
          currentStatus
        )}`}
      >
        {currentStatus.replace(/_/g, ' ')}
      </span>

      <select
        value={selectedStatus}
        disabled={isUpdating || saving}
        onChange={(e) => handleSelect(e.target.value as OrderStatus)}
        className="rounded-lg border border-input bg-background px-2 py-1 text-[11px] font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer disabled:opacity-50"
      >
        <option value="placed">Placed</option>
        <option value="confirmed">Confirmed</option>
        <option value="packed">Packed</option>
        <option value="shipped">Shipped</option>
        <option value="out_for_delivery">Out for Delivery</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );
}

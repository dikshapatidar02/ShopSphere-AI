'use client';

import type { OrderStatus, OrderTracking } from '@/types';
import { CheckCircle2, Clock, MapPin, PackageCheck } from 'lucide-react';

interface OrderTrackingTimelineProps {
  readonly tracking: OrderTracking;
}

const TRACKING_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'placed', label: 'Placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'packed', label: 'Packed' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
];

export function OrderTrackingTimeline({ tracking }: OrderTrackingTimelineProps) {
  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'packed':
        return 2;
      case 'shipped':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(tracking.currentStatus);

  if (tracking.currentStatus === 'cancelled') {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-xs font-semibold flex items-center gap-2">
        <Clock className="h-4 w-4 shrink-0" />
        <span>This order has been cancelled.</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <PackageCheck className="h-4 w-4 text-primary" />
            <span>Package Tracking</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Carrier: <strong className="text-foreground">{tracking.carrierName}</strong> • Tracking #{' '}
            <span className="font-mono text-foreground font-semibold">{tracking.trackingNumber}</span>
          </p>
        </div>

        <div className="text-xs text-muted-foreground font-medium">
          Est. Delivery: <strong className="text-foreground">{tracking.estimatedDeliveryDate}</strong>
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 scrollbar-none">
        {TRACKING_STEPS.map((step, idx) => {
          const isDone = idx <= activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.status} className="flex flex-col items-center gap-1.5 shrink-0 w-20 text-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs animate-pulse'
                    : isDone
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-border bg-muted text-muted-foreground'
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
              </div>
              <span className={`text-[11px] font-medium leading-tight ${isCurrent ? 'text-primary font-bold' : isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Event Log */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Activity Log
        </h4>
        <div className="space-y-2.5">
          {tracking.events.map((evt) => (
            <div key={evt.id} className="flex items-start gap-2.5 text-xs">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <span>{evt.description}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{evt.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

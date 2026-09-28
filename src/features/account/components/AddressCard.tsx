'use client';

import type { Address } from '@/types/address';
import { Check, Edit3, MapPin, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface AddressCardProps {
  readonly address: Address;
  readonly onEdit: (address: Address) => void;
  readonly onDelete: (id: string) => void;
  readonly onSetDefault: (id: string) => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-foreground">{address.recipientName}</span>
          </div>

          {address.isDefault && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              <Check className="h-3 w-3" /> Default
            </span>
          )}
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed pl-9">
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="font-medium text-foreground/80">{address.country}</p>
          {address.phone && <p className="mt-1 text-[11px]">Phone: {address.phone}</p>}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
        {!address.isDefault ? (
          <button
            type="button"
            onClick={() => onSetDefault(address.id)}
            className="text-xs font-medium text-primary hover:underline"
          >
            Set as Default
          </button>
        ) : (
          <span className="text-[11px] text-muted-foreground font-medium">Default Address</span>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(address)}
            aria-label={`Edit address for ${address.recipientName}`}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>

          {!showConfirmDelete ? (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              aria-label={`Delete address for ${address.recipientName}`}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 animate-in fade-in">
              <button
                type="button"
                onClick={() => onDelete(address.id)}
                className="rounded-lg bg-destructive px-2 py-1 text-[10px] font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmDelete(false)}
                className="rounded-lg border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

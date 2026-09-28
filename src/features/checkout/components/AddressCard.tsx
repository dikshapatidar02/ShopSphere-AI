'use client';

import type { Address } from '@/types';
import { Check, MapPin, Phone } from 'lucide-react';

interface AddressCardProps {
  readonly address: Address;
  readonly isSelected: boolean;
  readonly onSelect: (address: Address) => void;
}

export function AddressCard({ address, isSelected, onSelect }: AddressCardProps) {
  return (
    <div
      onClick={() => onSelect(address)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(address);
        }
      }}
      className={`relative flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-xs'
          : 'border-border bg-card hover:border-foreground/30'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <MapPin className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
            <span>{address.recipientName}</span>
          </div>

          {isSelected && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-3 w-3" />
            </span>
          )}
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed pl-6 space-y-0.5">
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
          {address.phone && (
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground/80 pt-1">
              <Phone className="h-3 w-3" />
              <span>{address.phone}</span>
            </p>
          )}
        </div>
      </div>

      {address.isDefault && (
        <div className="mt-3 pl-6">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            Default Address
          </span>
        </div>
      )}
    </div>
  );
}

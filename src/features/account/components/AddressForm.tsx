'use client';

import type { Address } from '@/types/address';
import { X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface AddressFormProps {
  readonly initialAddress?: Address | null;
  readonly onSubmit: (addressData: Omit<Address, 'id'>) => void;
  readonly onCancel: () => void;
}

export function AddressForm({
  initialAddress,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [recipientName, setRecipientName] = useState(initialAddress?.recipientName || '');
  const [line1, setLine1] = useState(initialAddress?.line1 || '');
  const [line2, setLine2] = useState(initialAddress?.line2 || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || '');
  const [country, setCountry] = useState(initialAddress?.country || 'United States');
  const [phone, setPhone] = useState(initialAddress?.phone || '');
  const [isDefault, setIsDefault] = useState(initialAddress?.isDefault || false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      recipientName: recipientName.trim(),
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      phone: phone.trim() || undefined,
      isDefault,
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-sm font-bold text-foreground">
          {initialAddress ? 'Edit Address' : 'Add New Address'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="recipientName" className="font-semibold text-foreground">
              Recipient Full Name *
            </label>
            <input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              placeholder="Jane Doe"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="phone" className="font-semibold text-foreground">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="line1" className="font-semibold text-foreground">
            Street Address *
          </label>
          <input
            id="line1"
            type="text"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            required
            placeholder="123 Shopping Blvd"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="line2" className="font-semibold text-foreground">
            Apartment, Suite, Unit (optional)
          </label>
          <input
            id="line2"
            type="text"
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            placeholder="Apt 4B"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="city" className="font-semibold text-foreground">
              City *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              placeholder="New York"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="state" className="font-semibold text-foreground">
              State / Province *
            </label>
            <input
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              placeholder="NY"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="postalCode" className="font-semibold text-foreground">
              Postal Code *
            </label>
            <input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              placeholder="10001"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="country" className="font-semibold text-foreground">
            Country *
          </label>
          <input
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="United States"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            id="isDefault"
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          />
          <label htmlFor="isDefault" className="font-medium text-foreground cursor-pointer">
            Set as my default shipping address
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-input bg-background px-4 py-2 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground hover:bg-primary/90 shadow-xs"
          >
            {initialAddress ? 'Update Address' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
}

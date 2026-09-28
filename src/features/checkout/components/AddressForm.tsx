'use client';

import { validateAddress, type AddressValidationError } from '@/services/addresses/address.service';
import type { Address } from '@/types';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface AddressFormProps {
  readonly onSaveAddress: (address: Address) => void;
  readonly onCancel?: () => void;
}

export function AddressForm({ onSaveAddress, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<Address>>({
    recipientName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  const [errors, setErrors] = useState<AddressValidationError>({});

  const handleChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof AddressValidationError]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateAddress(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      recipientName: formData.recipientName!.trim(),
      line1: formData.line1!.trim(),
      line2: formData.line2?.trim(),
      city: formData.city!.trim(),
      state: formData.state!.trim(),
      postalCode: formData.postalCode!.trim(),
      country: formData.country!.trim(),
      phone: formData.phone?.trim(),
    };

    onSaveAddress(newAddress);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Plus className="h-4 w-4 text-primary" />
          <span>Add New Shipping Address</span>
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel adding address"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Recipient Name */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="recipientName" className="font-semibold text-foreground">
            Full Name / Recipient Name *
          </label>
          <input
            id="recipientName"
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleChange('recipientName', e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.recipientName && (
            <p className="text-[11px] text-destructive font-medium">{errors.recipientName}</p>
          )}
        </div>

        {/* Address Line 1 */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="line1" className="font-semibold text-foreground">
            Street Address *
          </label>
          <input
            id="line1"
            type="text"
            value={formData.line1}
            onChange={(e) => handleChange('line1', e.target.value)}
            placeholder="123 Main Street"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.line1 && <p className="text-[11px] text-destructive font-medium">{errors.line1}</p>}
        </div>

        {/* Address Line 2 */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="line2" className="font-semibold text-foreground">
            Apartment, Suite, Unit (Optional)
          </label>
          <input
            id="line2"
            type="text"
            value={formData.line2}
            onChange={(e) => handleChange('line2', e.target.value)}
            placeholder="Apt 4B"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* City */}
        <div className="space-y-1">
          <label htmlFor="city" className="font-semibold text-foreground">
            City *
          </label>
          <input
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            placeholder="San Francisco"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.city && <p className="text-[11px] text-destructive font-medium">{errors.city}</p>}
        </div>

        {/* State */}
        <div className="space-y-1">
          <label htmlFor="state" className="font-semibold text-foreground">
            State / Province *
          </label>
          <input
            id="state"
            type="text"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="CA"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.state && <p className="text-[11px] text-destructive font-medium">{errors.state}</p>}
        </div>

        {/* Postal Code */}
        <div className="space-y-1">
          <label htmlFor="postalCode" className="font-semibold text-foreground">
            ZIP / Postal Code *
          </label>
          <input
            id="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            placeholder="94105"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.postalCode && (
            <p className="text-[11px] text-destructive font-medium">{errors.postalCode}</p>
          )}
        </div>

        {/* Country */}
        <div className="space-y-1">
          <label htmlFor="country" className="font-semibold text-foreground">
            Country *
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="United States"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.country && <p className="text-[11px] text-destructive font-medium">{errors.country}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="phone" className="font-semibold text-foreground">
            Phone Number (for delivery notifications)
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.phone && <p className="text-[11px] text-destructive font-medium">{errors.phone}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-border">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-input bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        >
          Save Address
        </button>
      </div>
    </form>
  );
}

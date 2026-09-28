'use client';

import { useAuth } from '@/hooks/use-auth';
import { loadUserAddresses, persistUserAddresses } from '@/services/addresses/address.service';
import type { Address } from '@/types';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';

interface AddressListProps {
  readonly selectedAddress: Address | null;
  readonly onSelectAddress: (address: Address) => void;
  readonly onNext: () => void;
}

export function AddressList({ selectedAddress, onSelectAddress, onNext }: AddressListProps) {
  const { user } = useAuth();
  const userId = user?.id || null;

  const [addresses, setAddresses] = useState<Address[]>(() => loadUserAddresses(userId));
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      onSelectAddress(defaultAddr);
    }
  }, [addresses, selectedAddress, onSelectAddress]);

  const handleSaveNewAddress = (newAddr: Address) => {
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    persistUserAddresses(userId, updated);
    onSelectAddress(newAddr);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Select Shipping Address
        </h2>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {showForm && (
        <AddressForm
          onSaveAddress={handleSaveNewAddress}
          onCancel={() => setShowForm(false)}
        />
      )}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedAddress?.id === addr.id}
              onSelect={onSelectAddress}
            />
          ))}
        </div>
      ) : !showForm ? (
        <div className="p-6 rounded-xl border border-dashed border-border text-center space-y-3">
          <p className="text-xs text-muted-foreground">
            No saved addresses found. Please add a shipping address to proceed.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Address</span>
          </button>
        </div>
      ) : null}

      <div className="flex justify-end pt-4 border-t border-border">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedAddress}
          className="rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-all"
        >
          Continue to Delivery Method
        </button>
      </div>
    </div>
  );
}

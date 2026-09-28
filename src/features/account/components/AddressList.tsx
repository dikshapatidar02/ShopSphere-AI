'use client';

import { MapPin, Plus } from 'lucide-react';
import { useAddresses } from '../hooks/use-addresses';
import { AccountEmptyState } from './AccountEmptyState';
import { AddressCard } from './AddressCard';
import { AddressForm } from './AddressForm';

export function AddressList() {
  const {
    addresses,
    isFormOpen,
    setIsFormOpen,
    editingAddress,
    setEditingAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Saved Addresses</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your default delivery addresses and shipping locations.
          </p>
        </div>

        {!isFormOpen && (
          <button
            type="button"
            onClick={() => {
              setEditingAddress(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </button>
        )}
      </div>

      {isFormOpen && (
        <AddressForm
          initialAddress={editingAddress}
          onSubmit={(data) => {
            if (editingAddress) {
              updateAddress(editingAddress.id, data);
            } else {
              addAddress(data);
            }
          }}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAddress(null);
          }}
        />
      )}

      {addresses.length === 0 && !isFormOpen ? (
        <AccountEmptyState
          title="No saved addresses"
          description="Add a shipping address to speed up your checkout process."
          actionLabel="Add Address"
          actionHref=""
          icon={<MapPin className="h-6 w-6" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(addr) => {
                setEditingAddress(addr);
                setIsFormOpen(true);
              }}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}

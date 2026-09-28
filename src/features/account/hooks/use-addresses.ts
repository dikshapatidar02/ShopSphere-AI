'use client';

import { useAuth } from '@/hooks/use-auth';
import { addressService } from '@/services/addresses/address.service';
import type { Address } from '@/types/address';
import { useCallback, useState } from 'react';

export function useAddresses() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [addresses, setAddresses] = useState<readonly Address[]>(() =>
    userId ? addressService.getAddresses(userId) : []
  );
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const refresh = useCallback(() => {
    if (!userId) return;
    setAddresses(addressService.getAddresses(userId));
  }, [userId]);

  const addAddress = useCallback(
    (newAddr: Omit<Address, 'id'>) => {
      if (!userId) return;
      addressService.addAddress(userId, newAddr);
      refresh();
      setIsFormOpen(false);
      setEditingAddress(null);
    },
    [userId, refresh]
  );

  const updateAddress = useCallback(
    (id: string, updates: Partial<Address>) => {
      if (!userId) return;
      addressService.updateAddress(userId, id, updates);
      refresh();
      setIsFormOpen(false);
      setEditingAddress(null);
    },
    [userId, refresh]
  );

  const deleteAddress = useCallback(
    (id: string) => {
      if (!userId) return;
      addressService.deleteAddress(userId, id);
      refresh();
    },
    [userId, refresh]
  );

  const setDefaultAddress = useCallback(
    (id: string) => {
      if (!userId) return;
      addressService.setDefaultAddress(userId, id);
      refresh();
    },
    [userId, refresh]
  );

  return {
    addresses,
    isFormOpen,
    setIsFormOpen,
    editingAddress,
    setEditingAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}

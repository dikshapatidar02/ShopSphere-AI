'use client';

import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export function useProfile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError('Name is required');
      return;
    }

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('A valid email address is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: trimmedName,
        email: trimmedEmail,
        phone: phone.trim() || undefined,
      });
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    isSubmitting,
    error,
    success,
    handleSubmit,
  };
}

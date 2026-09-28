'use client';

import { useAuthStore } from '@/store/auth.store';
import { useState } from 'react';

/**
 * Hook for managing guest vs authenticated user assistant session IDs.
 */
export function useAssistantSession() {
  const { user } = useAuthStore();
  const userId = user?.id;

  const [sessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'default_session';

    const userKey = userId || 'guest';
    const stored = localStorage.getItem(`shopsphere_assistant_active_session_${userKey}`);

    if (stored) {
      return stored;
    }

    const newId = `session_${userKey}_${Date.now()}`;
    localStorage.setItem(`shopsphere_assistant_active_session_${userKey}`, newId);
    return newId;
  });

  return {
    sessionId,
    userId,
  };
}

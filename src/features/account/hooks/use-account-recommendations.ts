'use client';

import { useAuth } from '@/hooks/use-auth';
import { preferencesService, type AccountPreferences } from '@/services/account/preferences.service';
import { useCallback, useState } from 'react';

export function useAccountPreferences() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [preferences, setPreferences] = useState<AccountPreferences>(() =>
    preferencesService.getPreferences(userId)
  );

  const updatePreferences = useCallback(
    (newPrefs: AccountPreferences) => {
      setPreferences(newPrefs);
      if (userId) {
        preferencesService.savePreferences(userId, newPrefs);
      }
    },
    [userId]
  );

  return {
    preferences,
    updatePreferences,
  };
}

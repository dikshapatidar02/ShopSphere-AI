'use client';

import { useAuth } from '@/hooks/use-auth';
import { useWishlistStore } from '@/store/wishlist.store';
import { useQuery } from '@tanstack/react-query';
import { accountService } from '../services/account.service';

export function useAccount() {
  const { user, isAuthenticated, logout } = useAuth();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const userId = user?.id ?? '';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['account-overview', userId, wishlistCount],
    queryFn: () => accountService.getOverview(userId, wishlistCount),
    enabled: Boolean(isAuthenticated && userId),
    staleTime: 1000 * 60 * 2, // 2 mins cache
  });

  return {
    user,
    isAuthenticated,
    logout,
    overview: data,
    isLoading,
    isError,
    refetch,
  };
}

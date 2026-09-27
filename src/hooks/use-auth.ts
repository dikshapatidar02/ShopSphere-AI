'use client';

import { useAuthStore } from '@/store/auth.store';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { useEffect } from 'react';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const status = useAuthStore((s) => s.status);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const error = useAuthStore((s) => s.error);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logoutStore = useAuthStore((s) => s.logout);
  const restoreSession = useAuthStore((s) => s.restoreSession);
  const clearError = useAuthStore((s) => s.clearError);

  const loadUserCart = useCartStore((s) => s.loadUserCart);
  const loadUserWishlist = useWishlistStore((s) => s.loadUserWishlist);

  // Auto restore session on mount
  useEffect(() => {
    if (!isHydrated) {
      restoreSession();
    }
  }, [isHydrated, restoreSession]);

  // Synchronize user ID changes with user-scoped stores
  useEffect(() => {
    const userId = user?.id || null;
    loadUserCart(userId);
    loadUserWishlist(userId);
  }, [user?.id, loadUserCart, loadUserWishlist]);

  const logout = () => {
    logoutStore();
    loadUserCart(null);
    loadUserWishlist(null);
  };

  return {
    user,
    session,
    status,
    isAuthenticated,
    isHydrated,
    isAdmin: user?.role === 'administrator',
    error,
    login,
    register,
    logout,
    restoreSession,
    clearError,
  };
}

'use client';

import { ProductGrid } from '@/features/products/components/ProductGrid';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { Clock, Trash2 } from 'lucide-react';
import { accountService } from '../services/account.service';
import { AccountEmptyState } from './AccountEmptyState';

export function RecentlyViewed() {
  const { user } = useAuth();
  const userId = user?.id || '';

  const { data: products = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['account-recently-viewed', userId],
    queryFn: () => accountService.getRecentlyViewedProducts(userId),
    enabled: Boolean(userId),
  });

  const handleClear = () => {
    if (!userId) return;
    localStorage.removeItem(`shopsphere_signals_${userId || 'guest'}`);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Recently Viewed Products</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Products you looked at during recent browsing sessions.
          </p>
        </div>

        {products.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-background px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors self-start sm:self-center"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {products.length === 0 && !isLoading ? (
        <AccountEmptyState
          title="No recently viewed products"
          description="Browse the product catalog to build your viewing history."
          actionLabel="Explore Catalog"
          actionHref="/products"
          icon={<Clock className="h-6 w-6" />}
        />
      ) : (
        <ProductGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      )}
    </div>
  );
}

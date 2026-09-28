import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWishlistStore } from '@/store/wishlist.store';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { WishlistView } from '../components/WishlistView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function renderWithQuery(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('WishlistView', () => {
  beforeEach(() => {
    useWishlistStore.getState().clearWishlist();
  });

  it('renders empty wishlist state when store is empty', () => {
    renderWithQuery(<WishlistView />);

    expect(screen.getByText(/Your Wishlist is Empty/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /Discover Products/i })).toBeDefined();
  });

  it('adds and removes items in wishlist store', () => {
    const store = useWishlistStore.getState();
    store.addItem('1');
    expect(useWishlistStore.getState().hasItem('1')).toBe(true);
    expect(useWishlistStore.getState().items.length).toBe(1);

    store.removeItem('1');
    expect(useWishlistStore.getState().hasItem('1')).toBe(false);
    expect(useWishlistStore.getState().items.length).toBe(0);
  });
});

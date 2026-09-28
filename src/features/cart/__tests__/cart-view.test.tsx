import { useCartStore } from '@/store/cart.store';
import type { Product } from '@/types';
import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartView } from '../components/CartView';

const mockProduct: Product = {
  id: 'prod-1',
  title: 'Wireless Headphones',
  description: 'High quality wireless sound',
  category: 'electronics',
  categoryName: 'Electronics',
  price: 100,
  discountPercentage: 10,
  discountedPrice: 90,
  rating: 4.8,
  stock: 10,
  brand: 'AudioTech',
  availability: 'in_stock',
  images: ['https://example.com/image.jpg'],
  thumbnail: 'https://example.com/thumb.jpg',
  reviewCount: 42,
  tags: ['audio', 'wireless'],
  specifications: [{ name: 'Warranty', value: '1 year' }],
  variants: [],
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
};

describe('CartView', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('renders empty cart state when cart is empty', () => {
    render(<CartView />);
    expect(screen.getByText(/Your Shopping Cart is Empty/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /Explore Products/i })).toBeDefined();
  });

  it('renders active cart item and calculates order summary', () => {
    useCartStore.getState().addItem(mockProduct, 2);

    render(<CartView />);

    expect(screen.getByText('Wireless Headphones')).toBeDefined();
    expect(screen.getByText('$180.00')).toBeDefined(); // 90 * 2 line total
    expect(screen.getByText('Order Summary')).toBeDefined();
  });

  it('merges duplicate product additions correctly up to stock limit', () => {
    const store = useCartStore.getState();
    store.addItem(mockProduct, 3);
    store.addItem(mockProduct, 4);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(7);
  });

  it('applies valid promo code correctly', () => {
    useCartStore.getState().addItem(mockProduct, 2);
    render(<CartView />);

    const input = screen.getByPlaceholderText(/Enter promo code/i);
    const applyBtn = screen.getByRole('button', { name: 'Apply' });

    fireEvent.change(input, { target: { value: 'WELCOME10' } });
    fireEvent.click(applyBtn);

    expect(screen.getByText('WELCOME10')).toBeDefined();
  });
});

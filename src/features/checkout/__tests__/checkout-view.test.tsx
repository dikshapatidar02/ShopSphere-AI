import { useCartStore } from '@/store/cart.store';
import { useCheckoutStore } from '@/store/checkout.store';
import type { Product } from '@/types';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CheckoutView } from '../components/CheckoutView';

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

describe('CheckoutView Component', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCheckoutStore.getState().resetCheckout();
  });

  it('renders empty cart state when cart has no items', () => {
    render(<CheckoutView />);
    expect(screen.getByText(/Your Cart is Empty/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /Explore Products/i })).toBeDefined();
  });

  it('renders shipping address step when cart has items', () => {
    useCartStore.getState().addItem(mockProduct, 1);
    render(<CheckoutView />);

    expect(screen.getByText('Select Shipping Address')).toBeDefined();
    expect(screen.getByText('Order Summary')).toBeDefined();
  });
});

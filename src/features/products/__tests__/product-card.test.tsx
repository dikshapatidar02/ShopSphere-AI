import type { Product } from '@/types';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProductCard } from '../components/ProductCard';

const mockProduct: Product = {
  id: 'prod-test-10',
  title: 'Noise Cancelling Headphones',
  description: 'Premium wireless audio headphones',
  category: 'audio',
  categoryName: 'Audio',
  brand: 'SoundPro',
  price: 200,
  discountPercentage: 20,
  discountedPrice: 160,
  rating: 4.8,
  reviewCount: 45,
  stock: 10,
  availability: 'in_stock',
  images: ['https://example.com/hp.jpg'],
  thumbnail: 'https://example.com/hp.jpg',
  tags: ['audio', 'headphones'],
  specifications: [],
  variants: [],
};

describe('ProductCard Component', () => {
  it('should render product title, brand, discounted price, and discount badge', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Noise Cancelling Headphones')).toBeDefined();
    expect(screen.getByText('SoundPro')).toBeDefined();
    expect(screen.getByText('$160.00')).toBeDefined();
    expect(screen.getByText('20% OFF')).toBeDefined();
  });
});

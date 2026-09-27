import type { Category } from '@/types';

export const MOCK_CATEGORIES: readonly Category[] = [
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Smartphones, laptops, audio gadgets, and accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1498049860654-af1a5c566876',
    productCount: 12,
  },
  {
    id: 'cat-laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'High performance computers and notebooks.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    parentId: 'cat-electronics',
    productCount: 4,
  },
  {
    id: 'cat-smartphones',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Latest flagship mobile devices and accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    parentId: 'cat-electronics',
    productCount: 5,
  },
  {
    id: 'cat-fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trendy apparel, footwear, and accessories.',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
    productCount: 8,
  },
  {
    id: 'cat-home-decoration',
    name: 'Home Decoration',
    slug: 'home-decoration',
    description: 'Modern lamps, furniture, and wall decor.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38',
    productCount: 6,
  },
  {
    id: 'cat-beauty',
    name: 'Beauty & Skincare',
    slug: 'beauty',
    description: 'Premium skincare, makeup, and perfumes.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e',
    productCount: 5,
  },
];

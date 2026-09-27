import type { DummyJsonProductDTO } from '@/types';
import { describe, expect, it } from 'vitest';
import { mapStockToAvailability, normalizeProduct } from '../products/product.mapper';

describe('Product Mapper / Normalizer', () => {
  it('should correctly map stock to availability states', () => {
    expect(mapStockToAvailability(0)).toBe('out_of_stock');
    expect(mapStockToAvailability(-5)).toBe('out_of_stock');
    expect(mapStockToAvailability(3)).toBe('low_stock');
    expect(mapStockToAvailability(5)).toBe('low_stock');
    expect(mapStockToAvailability(10)).toBe('in_stock');
  });

  it('should map a complete DTO into a valid domain Product model', () => {
    const dto: DummyJsonProductDTO = {
      id: 101,
      title: '  Wireless Headphones  ',
      description: 'Noise cancelling over-ear headphones',
      category: 'audio',
      price: 200,
      discountPercentage: 15,
      rating: 4.7,
      stock: 12,
      tags: ['audio', 'wireless'],
      brand: 'SoundMaster',
      images: ['https://example.com/img1.jpg'],
      thumbnail: 'https://example.com/thumb.jpg',
    };

    const product = normalizeProduct(dto);

    expect(product.id).toBe('101');
    expect(product.title).toBe('Wireless Headphones');
    expect(product.brand).toBe('SoundMaster');
    expect(product.price).toBe(200);
    expect(product.discountPercentage).toBe(15);
    expect(product.discountedPrice).toBe(170); // 200 * 0.85
    expect(product.rating).toBe(4.7);
    expect(product.stock).toBe(12);
    expect(product.availability).toBe('in_stock');
    expect(product.thumbnail).toBe('https://example.com/thumb.jpg');
  });

  it('should handle missing and malformed DTO fields defensively', () => {
    const partialDto: Partial<DummyJsonProductDTO> = {
      id: 42,
      // missing title, description, price, etc.
    };

    const product = normalizeProduct(partialDto);

    expect(product.id).toBe('42');
    expect(product.title).toBe('Untitled Product');
    expect(product.description).toBe('No description available.');
    expect(product.brand).toBe('Generic');
    expect(product.price).toBe(0);
    expect(product.discountedPrice).toBe(0);
    expect(product.stock).toBe(0);
    expect(product.availability).toBe('out_of_stock');
    expect(product.thumbnail).toContain('placeholder');
  });
});

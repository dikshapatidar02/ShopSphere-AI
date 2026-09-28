import { describe, expect, it } from 'vitest';
import { parseDiscoveryQuery, serializeDiscoveryQuery, validatePriceRange } from '../utils/query-serializer';

describe('Query Serializer & Parser', () => {
  it('should parse URL search parameters correctly', () => {
    const params = new URLSearchParams(
      'q=laptop&category=laptops&minPrice=500&maxPrice=1500&minRating=4&sort=price_asc&page=2'
    );
    const parsed = parseDiscoveryQuery(params);

    expect(parsed.q).toBe('laptop');
    expect(parsed.category).toBe('laptops');
    expect(parsed.minPrice).toBe(500);
    expect(parsed.maxPrice).toBe(1500);
    expect(parsed.minRating).toBe(4);
    expect(parsed.sort).toBe('price_asc');
    expect(parsed.page).toBe(2);
  });

  it('should handle missing and malformed parameters gracefully', () => {
    const params = new URLSearchParams('minPrice=invalid&page=-5&sort=unknown_sort');
    const parsed = parseDiscoveryQuery(params);

    expect(parsed.minPrice).toBeUndefined();
    expect(parsed.page).toBe(1);
    expect(parsed.sort).toBe('relevance');
  });

  it('should serialize query objects into clean URL strings', () => {
    const query = {
      q: '  phone  ',
      category: 'smartphones',
      minPrice: 200,
      sort: 'rating_desc' as const,
      page: 2,
    };

    const serialized = serializeDiscoveryQuery(query);
    expect(serialized).toBe('q=phone&category=smartphones&minPrice=200&sort=rating_desc&page=2');
  });

  it('should validate price range correctly', () => {
    expect(validatePriceRange(100, 500).isValid).toBe(true);
    expect(validatePriceRange(500, 100).isValid).toBe(false);
    expect(validatePriceRange(500, 100).error).toContain('Minimum price cannot be greater');
  });
});

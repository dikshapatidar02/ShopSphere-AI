import { describe, expect, it } from 'vitest';
import { QueryNormalizer } from '../query-normalizer';
import { EntityExtractor } from '../entity-extractor';
import { IntentParser } from '../intent-parser';

describe('QueryNormalizer', () => {
  it('normalizes currency, comma numbers, K/lakh notation and synonyms', () => {
    expect(QueryNormalizer.normalize('Show smartphones under ₹30,000')).toBe(
      'show smartphones under rs 30000'
    );
    expect(QueryNormalizer.normalize('Laptops within $500')).toBe(
      'laptops within usd 500'
    );
    expect(QueryNormalizer.normalize('Laptops within 70k')).toBe(
      'laptops within 70000'
    );
    expect(QueryNormalizer.normalize('Laptops within 2 lakh')).toBe(
      'laptops within 200000'
    );
    expect(QueryNormalizer.normalize('Earphones below 1.5k')).toBe(
      'headphones below 1500'
    );
    expect(QueryNormalizer.normalize('Mobiles under 20k')).toBe(
      'smartphones under 20000'
    );
  });
});

describe('EntityExtractor', () => {
  it('extracts categories, prices, ratings, brands, colors, and references', () => {
    const text = 'show blue techcorp smartphones under rs 30000 with 4+ stars';
    const entities = EntityExtractor.extract(text);

    expect(entities.category).toBe('smartphones');
    expect(entities.maxPrice).toBe(30000);
    expect(entities.minRating).toBe(4);
    expect(entities.brand).toBe('techcorp');
    expect(entities.color).toBe('blue');
  });

  it('extracts product references correctly', () => {
    expect(EntityExtractor.extract('add the first one to cart').productReference).toBe(0);
    expect(EntityExtractor.extract('tell me about the second one').productReference).toBe(1);
    expect(EntityExtractor.extract('tell me about the third one').productReference).toBe(2);
    expect(EntityExtractor.extract('compare item 1 and item 2').comparisonIndexes).toEqual([0, 1]);
  });
});

describe('IntentParser', () => {
  it('classifies intents accurately', () => {
    expect(IntentParser.parse('Show laptops under 70k').type).toBe('product_search');
    expect(IntentParser.parse('Add the second one to cart').type).toBe('add_to_cart');
    expect(IntentParser.parse('Save the first one').type).toBe('add_to_wishlist');
    expect(IntentParser.parse('Compare the first two').type).toBe('comparison');
    expect(IntentParser.parse('Recommend something for me').type).toBe('recommendation_request');
    expect(IntentParser.parse('Clear filters').type).toBe('clear_filters');
    expect(IntentParser.parse('Help me').type).toBe('help');
    expect(IntentParser.parse('Something cheaper', true).type).toBe('refine_results');
    expect(IntentParser.parse('headphones instead', true).type).toBe('refine_results');
    expect(IntentParser.parse('random gibberish 12345').type).toBe('unknown');
  });
});

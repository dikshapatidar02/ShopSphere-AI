import { describe, expect, it } from 'vitest';
import type { AssistantActiveContext } from '@/types/assistant';
import { RefinementHandler } from '../refinement-handler';
import { EntityExtractor } from '../entity-extractor';

describe('RefinementHandler', () => {
  it('handles "something cheaper" by reducing maxPrice', () => {
    const prev: AssistantActiveContext = {
      category: 'smartphones',
      maxPrice: 30000,
    };

    const refined = RefinementHandler.refine(prev, {}, 'something cheaper');
    expect(refined.category).toBe('smartphones');
    expect(refined.maxPrice).toBe(22500); // 30000 * 0.75
  });

  it('handles "better ratings" by boosting minRating and setting sort', () => {
    const prev: AssistantActiveContext = {
      category: 'headphones',
      minRating: 4.0,
    };

    const refined = RefinementHandler.refine(prev, {}, 'better ratings');
    expect(refined.minRating).toBe(4.5);
    expect(refined.sortBy).toBe('rating_desc');
  });

  it('applies brand and color filter refinements without dropping existing category', () => {
    const prev: AssistantActiveContext = {
      category: 'laptops',
      maxPrice: 70000,
    };

    const entities = EntityExtractor.extract('only hp');
    const refined = RefinementHandler.refine(prev, entities, 'only hp');

    expect(refined.category).toBe('laptops');
    expect(refined.maxPrice).toBe(70000);
    expect(refined.brand).toBe('hp');
  });
});

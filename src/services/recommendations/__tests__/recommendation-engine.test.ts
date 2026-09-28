import { describe, expect, it } from 'vitest';
import type { Product, RecommendationContext, UserPersonalizationSignals } from '@/types';
import { RecommendationEngine } from '../recommendation-engine';
import { RecommendationCandidates } from '../recommendation-candidates';
import { RecommendationRanking } from '../recommendation-ranking';
import { RecommendationService } from '../recommendation.service';
import { MockRecommendationProvider } from '../mock-recommendation.provider';
import type { ScoredCandidate } from '../recommendation-strategies/strategy.interface';

// Fixture Products
const sampleProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Flagship Smartphone X',
    description: 'High-end smartphone with OLED display',
    price: 999,
    discountedPrice: 899,
    discountPercentage: 10,
    rating: 4.8,
    reviewCount: 120,
    stock: 25,
    brand: 'TechCorp',
    category: 'smartphones',
    categoryName: 'Smartphones',
    thumbnail: '/phone.jpg',
    images: ['/phone.jpg'],
    tags: ['oled', '5g', 'flagship'],
    specifications: [],
    variants: [],
    availability: 'in_stock',
  },
  {
    id: 'prod-2',
    title: 'Mid-range Smartphone Y',
    description: 'Affordable smartphone with great battery life',
    price: 499,
    discountedPrice: 449,
    discountPercentage: 10,
    rating: 4.3,
    reviewCount: 45,
    stock: 50,
    brand: 'TechCorp',
    category: 'smartphones',
    categoryName: 'Smartphones',
    thumbnail: '/phone2.jpg',
    images: ['/phone2.jpg'],
    tags: ['5g', 'budget'],
    specifications: [],
    variants: [],
    availability: 'in_stock',
  },
  {
    id: 'prod-3',
    title: 'Wireless Headphones Pro',
    description: 'Noise cancelling over-ear headphones',
    price: 299,
    discountedPrice: 249,
    discountPercentage: 16,
    rating: 4.6,
    reviewCount: 200,
    stock: 15,
    brand: 'AudioMax',
    category: 'audio',
    categoryName: 'Audio',
    thumbnail: '/headphones.jpg',
    images: ['/headphones.jpg'],
    tags: ['anc', 'bluetooth'],
    specifications: [],
    variants: [],
    availability: 'in_stock',
  },
  {
    id: 'prod-4',
    title: 'Out of Stock Smartwatch',
    description: 'Fitness smartwatch',
    price: 199,
    discountedPrice: 199,
    discountPercentage: 0,
    rating: 4.1,
    reviewCount: 10,
    stock: 0,
    brand: 'TechCorp',
    category: 'wearables',
    categoryName: 'Wearables',
    thumbnail: '/watch.jpg',
    images: ['/watch.jpg'],
    tags: ['fitness'],
    specifications: [],
    variants: [],
    availability: 'out_of_stock',
  },
];

describe('RecommendationEngine & Candidate Filtering', () => {
  it('should filter out out-of-stock products and exclude current source product', () => {
    const rawCandidates: ScoredCandidate[] = [
      { product: sampleProducts[0], rawScore: 50, explanationReason: 'Match' },
      { product: sampleProducts[1], rawScore: 40, explanationReason: 'Match' },
      { product: sampleProducts[3], rawScore: 60, explanationReason: 'Match' }, // Stock 0
    ];

    const context: RecommendationContext = { productId: 'prod-1' };
    const filtered = RecommendationCandidates.filterCandidates(rawCandidates, context);

    expect(filtered.length).toBe(1);
    expect(filtered[0].product.id).toBe('prod-2');
  });

  it('should deduplicate candidates keeping higher rawScore', () => {
    const duplicateCandidates: ScoredCandidate[] = [
      { product: sampleProducts[0], rawScore: 30, explanationReason: 'Low score' },
      { product: sampleProducts[0], rawScore: 80, explanationReason: 'High score' },
    ];

    const deduplicated = RecommendationCandidates.deduplicateCandidates(duplicateCandidates);
    expect(deduplicated.length).toBe(1);
    expect(deduplicated[0].rawScore).toBe(80);
  });

  it('should rank candidates deterministically with score bounds [0, 100]', () => {
    const candidates: ScoredCandidate[] = [
      { product: sampleProducts[1], rawScore: 50, explanationReason: 'Medium' },
      { product: sampleProducts[0], rawScore: 100, explanationReason: 'High' },
    ];

    const ranked = RecommendationRanking.rankCandidates(candidates);
    expect(ranked[0].candidate.product.id).toBe('prod-1');
    expect(ranked[0].normalizedScore).toBe(100);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].candidate.product.id).toBe('prod-2');
    expect(ranked[1].normalizedScore).toBe(50);
    expect(ranked[1].rank).toBe(2);
  });
});

describe('All 9 Recommendation Strategies Engine Test', () => {
  const engine = new RecommendationEngine();

  it('1. recently_viewed strategy returns user history', () => {
    const signals: UserPersonalizationSignals = {
      recentlyViewedProductIds: ['prod-2', 'prod-1'],
      recentSearchQueries: [],
      wishlistProductIds: [],
      cartProductIds: [],
      purchasedProductIds: [],
      preferredCategories: {},
      preferredBrands: {},
    };

    const res = engine.execute(
      { userSignals: signals },
      'recently_viewed',
      sampleProducts
    );

    expect(res.strategy).toBe('recently_viewed');
    expect(res.items.length).toBe(2);
    expect(res.items[0].product.id).toBe('prod-2');
  });

  it('2. similar_products strategy evaluates category & brand similarity', () => {
    const res = engine.execute(
      { productId: 'prod-1', categorySlug: 'smartphones' },
      'similar_products',
      sampleProducts
    );

    expect(res.strategy).toBe('similar_products');
    expect(res.items.length).toBeGreaterThan(0);
    // Excludes prod-1
    expect(res.items.some((i) => i.product.id === 'prod-1')).toBe(false);
    expect(res.items[0].product.id).toBe('prod-2');
  });

  it('3. category_based strategy ranks products in specified or preferred category', () => {
    const res = engine.execute(
      { categorySlug: 'smartphones' },
      'category_based',
      sampleProducts
    );

    expect(res.strategy).toBe('category_based');
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.items.every((i) => i.product.category === 'smartphones')).toBe(true);
  });

  it('4. price_based strategy prioritizes price proximity', () => {
    const signals: UserPersonalizationSignals = {
      recentlyViewedProductIds: [],
      recentSearchQueries: [],
      wishlistProductIds: [],
      cartProductIds: [],
      purchasedProductIds: [],
      preferredCategories: {},
      preferredBrands: {},
      pricePreference: { min: 800, max: 1000, averageViewedPrice: 900 },
    };

    const res = engine.execute(
      { userSignals: signals },
      'price_based',
      sampleProducts
    );

    expect(res.strategy).toBe('price_based');
    expect(res.items[0].product.id).toBe('prod-1'); // price 899 matches range 800-1000
  });

  it('5. wishlist_based strategy derives candidates from wishlist signals', () => {
    const signals: UserPersonalizationSignals = {
      recentlyViewedProductIds: [],
      recentSearchQueries: [],
      wishlistProductIds: ['prod-1'],
      cartProductIds: [],
      purchasedProductIds: [],
      preferredCategories: { smartphones: 1 },
      preferredBrands: { techcorp: 1 },
    };

    const res = engine.execute(
      { userSignals: signals, currentWishlistProductIds: ['prod-1'] },
      'wishlist_based',
      sampleProducts
    );

    expect(res.strategy).toBe('wishlist_based');
    expect(res.items.length).toBeGreaterThan(0);
  });

  it('6. cart_based strategy generates complementary cart recommendations', () => {
    const res = engine.execute(
      { currentCartProductIds: ['prod-1'] },
      'cart_based',
      sampleProducts
    );

    expect(res.strategy).toBe('cart_based');
    expect(res.items.length).toBeGreaterThan(0);
  });

  it('7. frequently_bought_together strategy ranks derived co-occurrences', () => {
    const res = engine.execute(
      { productId: 'prod-1' },
      'frequently_bought_together',
      sampleProducts
    );

    expect(res.strategy).toBe('frequently_bought_together');
    expect(res.items.length).toBeGreaterThan(0);
  });

  it('8. trending strategy produces deterministic trending scores without randomness', () => {
    const res1 = engine.execute({}, 'trending', sampleProducts);
    const res2 = engine.execute({}, 'trending', sampleProducts);

    expect(res1.items.length).toBe(res2.items.length);
    expect(res1.items[0].product.id).toBe(res2.items[0].product.id);
  });

  it('9. personalized_for_you handles cold start user gracefully with fallback', () => {
    const res = engine.execute({}, 'personalized_for_you', sampleProducts);

    expect(res.items.length).toBeGreaterThan(0);
    expect(res.total).toBe(res.items.length);
  });
});

describe('RecommendationService & Provider Integration', () => {
  it('should return valid recommendations through service facade', async () => {
    const service = new RecommendationService(new MockRecommendationProvider());
    const res = await service.getTrending(4);

    expect(res.strategy).toBe('trending');
    expect(res.title).toBe('Trending Now');
    expect(Array.isArray(res.items)).toBe(true);
  });
});

import type { ExtractedEntities } from '@/types/assistant';

const KNOWN_CATEGORIES: Record<string, string> = {
  smartphones: 'smartphones',
  smartphone: 'smartphones',
  phone: 'smartphones',
  laptops: 'laptops',
  laptop: 'laptops',
  headphones: 'audio',
  audio: 'audio',
  wearables: 'wearables',
  watches: 'wearables',
  watch: 'wearables',
  beauty: 'beauty',
  fragrances: 'fragrances',
  groceries: 'groceries',
  skincare: 'skincare',
  furniture: 'furniture',
  home: 'home-decoration',
};

const KNOWN_BRANDS = [
  'techcorp',
  'audiomax',
  'apple',
  'samsung',
  'sony',
  'hp',
  'dell',
  'lenovo',
  'asus',
  'beautyblend',
  'nike',
  'adidas',
  'rolex',
  'fossil',
];

const KNOWN_COLORS = [
  'black',
  'white',
  'blue',
  'red',
  'green',
  'silver',
  'gold',
  'grey',
  'gray',
  'pink',
  'purple',
];

/**
 * Entity Extractor for AI Assistant.
 * Extracts shopping entities (category, price, rating, brand, color, sort, product references)
 * from normalized user text.
 */
export class EntityExtractor {
  public static extract(normalizedText: string): ExtractedEntities {
    const category = this.extractCategory(normalizedText);
    const { minPrice, maxPrice } = this.extractPrice(normalizedText);
    const minRating = this.extractRating(normalizedText);
    const brand = this.extractBrand(normalizedText);
    const color = this.extractColor(normalizedText);
    const sortBy = this.extractSort(normalizedText);
    const productReference = this.extractProductReference(normalizedText);
    const comparisonIndexes = this.extractComparisonIndexes(normalizedText);

    return {
      category,
      minPrice,
      maxPrice,
      minRating,
      brand,
      color,
      sortBy,
      productReference,
      comparisonIndexes,
      keywords: this.extractKeywords(normalizedText),
    };
  }

  private static extractCategory(text: string): string | undefined {
    for (const [key, value] of Object.entries(KNOWN_CATEGORIES)) {
      if (new RegExp(`\\b${key}\\b`, 'i').test(text)) {
        return value;
      }
    }
    return undefined;
  }

  private static extractPrice(text: string): { minPrice?: number; maxPrice?: number } {
    // Range: between 20000 and 40000 / 20000 - 40000
    const rangeMatch = text.match(/(?:between|from)?\s*(?:rs|usd)?\s*(\d+)\s*(?:to|-|and)\s*(?:rs|usd)?\s*(\d+)/i);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1], 10);
      const max = parseInt(rangeMatch[2], 10);
      return { minPrice: Math.min(min, max), maxPrice: Math.max(min, max) };
    }

    // Max Price: under 30000 / below 30000 / less than 30000 / max 30000 / <= 30000
    const maxMatch = text.match(/(?:under|below|less than|within|cheaper than|max(?:imum)?)\s*(?:rs|usd)?\s*(\d+)/i);
    if (maxMatch) {
      return { maxPrice: parseInt(maxMatch[1], 10) };
    }

    // Min Price: above 20000 / more than 20000 / over 20000 / min 20000
    const minMatch = text.match(/(?:above|over|more than|atleast|at least|min(?:imum)?)\s*(?:rs|usd)?\s*(\d+)/i);
    if (minMatch) {
      return { minPrice: parseInt(minMatch[1], 10) };
    }

    // Standalone price after category or prompt: "smartphones 30000"
    const standaloneMatch = text.match(/\b(?:rs|usd)\s*(\d+)\b/i);
    if (standaloneMatch) {
      return { maxPrice: parseInt(standaloneMatch[1], 10) };
    }

    return {};
  }

  private static extractRating(text: string): number | undefined {
    // 4 stars / 4.5 stars / 4+ / 4 star
    const ratingMatch = text.match(/\b([1-5](?:\.[0-9])?)\s*(?:\+|stars?|rating)/i);
    if (ratingMatch) {
      const val = parseFloat(ratingMatch[1]);
      if (val >= 1 && val <= 5) {
        return val;
      }
    }

    if (/\b(good|high|top|best)\s+ratings?\b/i.test(text) || /\b(best rated|top rated)\b/i.test(text)) {
      return 4.0;
    }

    return undefined;
  }

  private static extractBrand(text: string): string | undefined {
    for (const b of KNOWN_BRANDS) {
      if (new RegExp(`\\b${b}\\b`, 'i').test(text)) {
        return b;
      }
    }
    return undefined;
  }

  private static extractColor(text: string): string | undefined {
    for (const c of KNOWN_COLORS) {
      if (new RegExp(`\\b${c}\\b`, 'i').test(text)) {
        return c === 'gray' ? 'grey' : c;
      }
    }
    return undefined;
  }

  private static extractSort(
    text: string
  ): 'price_asc' | 'price_desc' | 'rating_desc' | 'relevance' | undefined {
    if (/\b(cheapest|lowest price|price low to high)\b/i.test(text)) {
      return 'price_asc';
    }
    if (/\b(most expensive|highest price|price high to low)\b/i.test(text)) {
      return 'price_desc';
    }
    if (/\b(highest rated|top rated|best rating|best rated)\b/i.test(text)) {
      return 'rating_desc';
    }
    return undefined;
  }

  private static extractProductReference(text: string): number | undefined {
    if (/\b(first|1st|number 1|item 1|#1|the 1st one|the first one)\b/i.test(text)) return 0;
    if (/\b(second|2nd|number 2|item 2|#2|the 2nd one|the second one)\b/i.test(text)) return 1;
    if (/\b(third|3rd|number 3|item 3|#3|the 3rd one|the third one)\b/i.test(text)) return 2;
    if (/\b(fourth|4th|number 4|item 4|#4|the 4th one|the fourth one)\b/i.test(text)) return 3;
    if (/\b(fifth|5th|number 5|item 5|#5)\b/i.test(text)) return 4;
    return undefined;
  }

  private static extractComparisonIndexes(
    text: string
  ): [number, number] | undefined {
    if (/\b(first\s+two|first\s+2|1\s*and\s*2|item\s*1\s*and\s*item\s*2|first\s+and\s+second)\b/i.test(text)) {
      return [0, 1];
    }
    if (/\b(second\s+and\s+third|2\s*and\s*3|item\s*2\s*and\s*item\s*3)\b/i.test(text)) {
      return [1, 2];
    }
    if (/\b(first\s+and\s+third|1\s*and\s*3|item\s*1\s*and\s*item\s*3)\b/i.test(text)) {
      return [0, 2];
    }
    return undefined;
  }

  private static extractKeywords(text: string): readonly string[] {
    const stopwords = new Set([
      'show',
      'me',
      'find',
      'get',
      'search',
      'for',
      'with',
      'under',
      'above',
      'rs',
      'usd',
      'only',
      'something',
      'and',
      'or',
      'the',
      'a',
      'an',
      'in',
      'on',
    ]);
    const tokens = text.split(/\s+/).filter((t) => t.length > 2 && !stopwords.has(t));
    return tokens;
  }
}

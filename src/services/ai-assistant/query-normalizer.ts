/**
 * Normalizes user queries by standardizing casing, punctuation, number representations,
 * currency formats, and shopping-related synonyms.
 */
export class QueryNormalizer {
  /**
   * Normalizes raw user input string.
   */
  public static normalize(raw: string): string {
    if (!raw) return '';

    let text = raw.trim().toLowerCase();

    // 1. Currency & symbol normalization
    text = text.replace(/₹/g, 'rs ');
    text = text.replace(/\$/g, 'usd ');
    text = text.replace(/rs\.?/g, 'rs');

    // 2. Comma numbers (e.g. 30,000 -> 30000)
    text = text.replace(/(\d+),(\d+)/g, '$1$2');

    // 3. Indian / Short Number Multipliers: 30k -> 30000, 1.5k -> 1500, 1 lakh -> 100000
    text = text.replace(/(\d+(?:\.\d+)?)\s*k\b/g, (_, num) => {
      return String(Math.round(parseFloat(num) * 1000));
    });

    text = text.replace(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)s?\b/g, (_, num) => {
      return String(Math.round(parseFloat(num) * 100000));
    });

    // 4. Words to numbers for simple terms
    text = text.replace(/\bthirty\s*thousand\b/g, '30000');
    text = text.replace(/\btwenty\s*thousand\b/g, '20000');
    text = text.replace(/\bfifty\s*thousand\b/g, '50000');

    // 5. Common shopping synonym mappings
    text = text.replace(/\b(mobiles|mobile|phones|cellphone)\b/g, 'smartphones');
    text = text.replace(/\b(earphones|earbuds|headset)\b/g, 'headphones');
    text = text.replace(/\b(watch|smartwatches)\b/g, 'watches');
    text = text.replace(/\b(laptop|notebooks)\b/g, 'laptops');

    // 6. Clean extra spaces
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }
}

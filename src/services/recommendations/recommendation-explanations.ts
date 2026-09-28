import type { RecommendationStrategy } from '@/types';

/**
 * Handles title generation and explanation formatting for recommendation strategies.
 */
export class RecommendationExplanations {
  private static readonly STRATEGY_TITLES: Record<
    RecommendationStrategy,
    { title: string; subtitle: string }
  > = {
    recently_viewed: {
      title: 'Recently Viewed',
      subtitle: 'Products you looked at recently',
    },
    similar_products: {
      title: 'Similar Products',
      subtitle: 'Based on attributes of the product you are viewing',
    },
    category_based: {
      title: 'Popular in This Category',
      subtitle: 'Top items in your favorite shopping categories',
    },
    price_based: {
      title: 'In Your Preferred Price Range',
      subtitle: 'Curated products matching your budget preferences',
    },
    wishlist_based: {
      title: 'Based on Your Wishlist',
      subtitle: 'Products similar to items saved in your wishlist',
    },
    cart_based: {
      title: 'Complementary Cart Items',
      subtitle: 'Great additions based on items currently in your cart',
    },
    frequently_bought_together: {
      title: 'Frequently Bought Together',
      subtitle: 'Products often purchased together by shoppers',
    },
    trending: {
      title: 'Trending Now',
      subtitle: 'Hot items popular across the ShopSphere community',
    },
    personalized_for_you: {
      title: 'Recommended For You',
      subtitle: 'Handpicked products tailored to your shopping behavior',
    },
  };

  /**
   * Retrieves default header title and subtitle for a recommendation strategy.
   */
  public static getStrategyHeader(strategy: RecommendationStrategy): {
    title: string;
    subtitle: string;
  } {
    return (
      this.STRATEGY_TITLES[strategy] ?? {
        title: 'Recommended Products',
        subtitle: 'Selected items for you',
      }
    );
  }

  /**
   * Formats raw explanation text into a clean user-facing sentence.
   */
  public static formatExplanation(rawExplanation: string): string {
    if (!rawExplanation || rawExplanation.trim().length === 0) {
      return 'Recommended for you based on popularity';
    }

    const trimmed = rawExplanation.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
}

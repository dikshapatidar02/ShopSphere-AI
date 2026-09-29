# ShopSphere AI — Recommendation Engine Architecture

## Overview

The ShopSphere AI Recommendation Engine is a **multi-strategy, multi-signal recommendation pipeline**. It operates entirely outside React UI components, executing candidate generation, filtering, scoring, deduplication, and explanation generation behind a unified service abstraction.

```text
┌─────────────────────────────────────────────────────────┐
│                    UI Component                         │
│            (<RecommendationRail productId=... />)       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                 Recommendation Hook                     │
│                  (useRecommendations)                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                Recommendation Service                   │
│             (getRecommendations(context))               │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                Recommendation Engine                    │
│   (Candidate Gen → Filtering → Scoring → Ranking)       │
└────────────────────────────┬────────────────────────────┘
                             │
             ┌───────────────┴───────────────┐
             ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│  Strategy 1: Similar    │ ... │  Strategy 9: Trending   │
└─────────────────────────┘     └─────────────────────────┘
```

---

## The 9 Recommendation Strategies

ShopSphere AI implements 9 distinct recommendation strategies:

| Strategy | Engine Identifier | Primary Input Signal | Description |
| :--- | :--- | :--- | :--- |
| **1. Recently Viewed** | `recently-viewed` | Browsing history | Recommends items recently inspected by the user. |
| **2. Similar Products** | `similar-products` | Current product ID | Scores items sharing category, brand, and price bracket. |
| **3. Category-Based** | `category-based` | Active category | Filters highest-rated products within the current category. |
| **4. Price-Based** | `price-based` | Target price range | Identifies items within ±20% of the active product price. |
| **5. Wishlist-Based** | `wishlist-based` | Wishlist items | Finds items complementary to items saved in wishlist. |
| **6. Cart-Based** | `cart-based` | Active cart items | Cross-sells products commonly paired with cart items. |
| **7. Frequently Bought** | `frequently-bought` | Product co-occurrence | Evaluates cross-category co-purchase affinities. |
| **8. Trending** | `trending` | Catalog ratings & views| Highlights top-rated, highly viewed catalog items. |
| **9. Personalized** | `personalized` | Composite user profile | Blends browsing, wishlist, cart, and rating affinity. |

---

## Recommendation Pipeline Sequence

```text
User / Context Request
         ↓
Candidate Generation (Collect candidates across selected strategies)
         ↓
Candidate Filtering (Remove already purchased, active PDP item, or out-of-stock items)
         ↓
Scoring & Weighting (Apply category affinity, price similarity, rating weights)
         ↓
Deduplication & Ranking (Eliminate duplicate candidate IDs & sort descending by score)
         ↓
Explanation Generation (Attach human-readable justification badges)
         ↓
Analytics Instrumentation (Track impression signals and click conversion rates)
```

---

## Human-Readable Explanations

Each recommendation item returned by the engine is decorated with an explanatory reason:
- *"Based on your interest in Smartphones"*
- *"Frequently paired with items in your cart"*
- *"Top rated in Electronics"*
- *"Similar to items in your wishlist"*

---

## Cold-Start Handling

When a user has no browsing history, cart items, or saved wishlist products (cold-start state), the engine gracefully falls back to the **Trending** and **Category Top Rated** strategies, ensuring high-quality recommendation rails are always presented.

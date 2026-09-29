# ShopSphere AI — AI Shopping Assistant Guide

## Overview

The ShopSphere AI Shopping Assistant is an embedded, **rule-based, deterministic conversational agent**. It allows users to search the product catalog, refine queries using natural language, compare items, inspect product specs, and take direct actions (add to cart, add to wishlist) within the chat interface.

> [!NOTE]
> **Deterministic & Zero-Cost Architecture**:
> The assistant is built without external LLM APIs (OpenAI/Gemini/Claude). It processes user input via localized token normalization, pattern matching, and entity extraction algorithms behind a provider abstraction (`IAssistantProvider`), ensuring 100% deterministic operation with zero API key costs.

---

## Architectural Pipeline

```text
User Message Input
        ↓
Query Normalization (Lowercase, trim punctuation, normalize tokens)
        ↓
Intent Parsing (Search, Filter, Refine, Compare, Cart Action, Help)
        ↓
Entity Extraction (Brand, Category, Price Limit, Rating Target, Color)
        ↓
Conversation State Update (Persist search context across multi-turn queries)
        ↓
Catalog Search & Recommendation Bridge (Filter product catalog by entities)
        ↓
Response Builder (Generate text, option pills, product reference cards)
```

---

## Supported Intents & Sample Queries

### 1. Product Search
- *"Show me smartphones under $500"*
- *"Find me wireless noise canceling headphones"*
- *"Looking for Apple laptops with high rating"*

### 2. Multi-Turn Refinements
- *"Something cheaper"* → Adjusts price limit down by 20%.
- *"Show only Samsung"* → Applies brand entity filter.
- *"Better ratings"* → Constrains results to `rating >= 4.5`.
- *"Clear filters"* → Resets search entities to initial query state.

### 3. Product Comparison
- *"Compare iPhone 13 and Galaxy S21"* → Renders side-by-side spec comparison table.

### 4. Interactive E-Commerce Actions
- *"Add item 1 to cart"* → Directly pushes target item to global cart store.
- *"Add this to my wishlist"* → Toggles target item in wishlist store.

---

## Conversation UI Components

The AI Assistant panel integrates directly with application UI controls:
- **Floating Trigger Button**: Accessible from the bottom-right corner of any customer route.
- **Product Reference Badges**: Rich product cards embedded directly inside message bubbles with pricing, thumbnail, rating, and quick action buttons.
- **Quick Suggestion Pills**: Tap-to-submit suggested query chips (*"Laptops under $1000"*, *"Top Rated Watches"*, *"Clear Filters"*).

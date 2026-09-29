# ShopSphere AI — System Architecture Specification

## Overview

ShopSphere AI is designed around a **clean, layered, feature-sliced frontend architecture**. The architecture cleanly separates user interface components, application hooks, domain service layers, data providers, state management, and type contracts.

```text
┌─────────────────────────────────────────────────────────┐
│                     UI Components                       │
│    (App Router Pages, Feature Views, UI Controls)       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                         │
│           (useAuth, useCart, useWishlist)               │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                   Domain Services                       │
│ (ProductService, OrderService, RecommendationService)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Provider Interfaces                    │
│     (IProductProvider, IOrderProvider, etc.)           │
└────────────────────────────┬────────────────────────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌───────────────────────┐         ┌───────────────────────┐
│   Mock Data Provider  │         │   HTTP API Provider   │
│  (DummyJSON / Seed)   │         │ (Future REST Backend) │
└───────────────────────┘         └───────────────────────┘
```

---

## Directory Responsibilities

### 1. `src/app/`
Contains Next.js App Router route segments, page components, error boundaries, loading views, and global layouts:
- `/` — Homepage featuring recommendation rails and categories.
- `/products` & `/products/[id]` — Product discovery, search, and detail views.
- `/cart` & `/checkout` — Cart management and multi-step order checkout flow.
- `/account/*` — Customer profile, address book, orders history, and wishlist.
- `/admin/*` — Administrator dashboard, product inventory CRUD, order workflows, and recommendation analytics.

### 2. `src/features/`
Feature-sliced modules grouping domain UI components, views, and feature-specific tests:
- `features/products/` — Product card, gallery, discovery filters, sorting, and pagination.
- `features/cart/` — Cart view, quantity controls, cart drawer, and summary calculations.
- `features/wishlist/` — Wishlist grid, wishlist item cards, and empty states.
- `features/checkout/` — Checkout address selector, payment form, and order summary.
- `features/recommendations/` — Recommendation rail, recommendation cards, and reason badges.
- `features/ai-assistant/` — Floating assistant drawer, dialogue messages, product reference badges.
- `features/admin/` — Admin metrics cards, product management table, status controls, analytics charts.
- `features/account/` — Profile form, address manager, order detail timeline, preferences.

### 3. `src/services/`
Encapsulates domain logic and business workflows outside UI components:
- `ProductService` & `CategoryService` — Data retrieval, filtering, and normalization.
- `RecommendationService` & `RecommendationEngine` — Algorithmic recommendation scoring.
- `AssistantService` — Intent parsing, entity extraction, and dialogue management.
- `OrderService` & `PaymentService` — Order creation, order tracking, and deterministic payment processing.
- `AuthService` — User login, registration, and role assertion.

### 4. `src/store/`
Zustand global stores managing persistent client state:
- `auth.store.ts` — Active user session, user role (`customer` | `admin`), session expiration.
- `cart.store.ts` — Cart items, item quantities, applied promo codes, subtotal calculations.
- `wishlist.store.ts` — Wishlist product IDs, add/remove toggles.
- `checkout.store.ts` — Transient checkout state and shipping address selections.

### 5. `src/types/`
TypeScript interface contracts ensuring strict compile-time safety:
- `product.ts` — Product schemas, categories, reviews, and filter parameters.
- `cart.ts` — Cart items, coupon definitions, and summary metrics.
- `order.ts` — Order models, shipping addresses, payment details, and order status types.
- `recommendation.ts` — Candidate models, strategy identifiers, scoring criteria, and explanations.
- `assistant.ts` — Dialogue message types, extracted entities, parsed intents, and assistant state.
- `auth.ts` — User profiles, session tokens, user roles, and login credentials.

---

## Service Layer & Provider Pattern

Every domain service interacts with data through an interface contract (`IProductProvider`, `IOrderProvider`, `IRecommendationProvider`). 

This architecture provides key advantages:
1. **Frontend Independence**: The frontend relies on mock data seeds (`DummyJSON`) without hardcoding endpoint URLs into UI components.
2. **Seamless Backend Transition**: A real backend can be connected simply by implementing the provider interface without refactoring components or hooks.
3. **Deterministic Testing**: Unit and integration tests mock provider methods directly to verify component behavior deterministically.

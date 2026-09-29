# ShopSphere AI — Project Directory Guide

## Overview

This guide details the internal file layout of ShopSphere AI to assist developers when navigating, adding features, or extending service layers.

---

## Directory Hierarchy & Guidelines

```text
ShopSphere AI/
├── docs/                     # Technical architecture & subsystem documentation
├── public/                   # Static assets (images, icons, favicon)
├── src/
│   ├── app/                  # Next.js App Router routing segments & layouts
│   │   ├── (auth)/           # Authentication route groups (/login, /register)
│   │   ├── account/          # Customer dashboard tabs (/profile, /orders, /wishlist)
│   │   ├── admin/            # Admin dashboard tabs (/products, /orders, /analytics)
│   │   ├── cart/             # Shopping cart page
│   │   ├── checkout/         # Order checkout flow & success page
│   │   ├── orders/           # User order tracking
│   │   ├── products/         # PDP & Product discovery pages
│   │   └── search/           # Search results page
│   ├── components/           # Shared & accessible UI components
│   │   ├── common/           # AccessibilityAnnouncer, SkipLink, Header, Footer
│   │   └── ui/               # Base UI elements (Button, Input, Badge, Dialog)
│   ├── features/             # Domain UI modules grouped by feature domain
│   │   ├── account/
│   │   ├── admin/
│   │   ├── ai-assistant/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── products/
│   │   └── recommendations/
│   ├── hooks/                # React custom hooks (useAuth, useCart, useWishlist)
│   ├── lib/                  # Auth session helpers, storage utilities
│   ├── services/             # Domain logic services & provider abstractions
│   ├── store/                # Zustand global state stores
│   └── types/                # TypeScript interface contracts
└── tests/                    # E2E test specs (Playwright)
```

---

## Developer Contribution Rules

1. **Keep UI Components Decoupled**: Business logic, data transformation, and algorithmic scoring belong in `services/`, not inside React rendering components.
2. **Strict Schema Contracts**: All service parameters and API responses must use explicit TypeScript interfaces from `types/`. Avoid `any`.
3. **Provider Abstraction**: Data access must go through provider interfaces (`IProductProvider`, `IOrderProvider`) to maintain mock/real API flexibility.
4. **Testing Requirement**: New feature additions must include unit/integration tests in `features/<feature>/__tests__/` or `services/<service>/__tests__/`.

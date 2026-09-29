# ShopSphere AI — Testing & Quality Automation Specification

## Overview

ShopSphere AI adheres to a strict automated testing strategy combining unit tests, integration tests, component rendering tests, and end-to-end (E2E) browser automation flows.

```text
┌─────────────────────────────────────────────────────────┐
│                Playwright E2E Tests                     │
│      (14 Specs: Customer Flows, Admin, AI Assistant)   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│           React Testing Library Components              │
│       (ProductCard, CartView, DeleteDialog, etc.)       │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│               Vitest Unit & Service Suite               │
│     (35 Spec Files: Services, Stores, Intent Parsers)   │
└─────────────────────────────────────────────────────────┘
```

---

## Test Execution Summary

- **TypeScript Checking**: `npx tsc --noEmit` — **0 Errors**
- **ESLint Audit**: `npm run lint` — **0 Errors**
- **Vitest Suite**: **35 Test Files / 113 Tests Passed**
- **Playwright E2E Suite**: **14 Specs / 14 Tests Passed**
- **Coverage Goal**: **>70% Code Coverage** across stores, services, and business logic.

---

## Available Test Commands

| Command | Tool | Purpose |
| :--- | :--- | :--- |
| `npm test` | Vitest | Runs all unit and integration test files headlessly. |
| `npm run test:watch` | Vitest | Runs Vitest in interactive watch mode for TDD. |
| `npm run test:coverage` | Vitest / v8 | Generates HTML and LCOV code coverage reports. |
| `npm run test:e2e` | Playwright | Runs headless E2E browser tests across Chromium. |
| `npm run test:e2e:ui` | Playwright | Opens interactive Playwright UI runner. |

---

## Key E2E Playwright Flows Covered

1. **Authentication E2E**: User registration, login redirect, protected route enforcement, logout.
2. **Product Discovery E2E**: Homepage navigation, search input, category filtering, price sorting.
3. **Product Details & Cart E2E**: PDP image gallery, spec inspection, quantity selector, add-to-cart action.
4. **Cart & Wishlist E2E**: Cart drawer toggle, quantity increment/decrement, wishlist toggles.
5. **Checkout & Orders E2E**: Shipping address entry, mock payment authorization, order confirmation.
6. **Recommendation Engine E2E**: Recommendation rail rendering, reason badges, PDP recommendations.
7. **AI Shopping Assistant E2E**: Floating trigger, dialogue query submission, product card rendering.
8. **User Dashboard E2E**: Account profile tab, address book, orders history timeline, preferences.
9. **Admin Dashboard E2E**: Admin overview analytics cards, product table, status management dialogs.
10. **Accessibility E2E**: Skip link navigation, landmark headings, focusable elements, modal Escape closing.

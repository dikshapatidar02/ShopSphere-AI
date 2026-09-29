# ShopSphere AI — Production-Grade Intelligent E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0.2-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.63-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com/)

**ShopSphere AI** is an advanced, production-style, frontend-first e-commerce web application engineered with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. It features a multi-strategy recommendation engine, a deterministic rule-based AI shopping assistant, real-time cart and wishlist management, customer and administrator dashboards, and comprehensive automated testing.

---

## 🚀 Live Demo & Deployment

- **Live Production URL**: [ShopSphere AI on Vercel](https://shopsphere-ai.vercel.app) *(Branch: `feature/deployment`)*
- **Deployment Platform**: Vercel (Next.js App Router Runtime)

---

## 🌟 Key Feature Overview

### 🛍️ Customer Journey & Core E-Commerce
- **Product Discovery & Search**: Full-text client search, category filtering, price sorting, rating filters, and paginated product grids backed by server-state caching (`@tanstack/react-query`).
- **Rich Product Detail Pages (PDP)**: Interactive image gallery, stock status indicators, spec lists, customer reviews, and contextual recommendations.
- **Cart & Wishlist Management**: Reactive cart drawers/pages, quantity adjustments, coupon validation, subtotal calculation, and instant user-scoped local persistence (`zustand`).
- **Checkout & Order Flow**: Multi-step checkout with address selection/creation, deterministic mock payment processing, order confirmation, and order history tracking.
- **User Account Dashboard**: Profile management, address book management, order history details, wishlist grid, recently viewed items, and personalized recommendation preferences.

### 🧠 Multi-Strategy Recommendation Engine
ShopSphere AI features a decoupled, 9-strategy recommendation pipeline built behind provider abstractions:
1. **Recently Viewed**: Surfaces products based on user browsing signals.
2. **Similar Products**: Calculates category and tag overlap score.
3. **Category-Based**: Filters top items within matching categories.
4. **Price-Based**: Identifies items within target price brackets.
5. **Wishlist-Based**: Recommends items complementary to user wishlist entries.
6. **Cart-Based**: Identifies cross-sell items based on active cart contents.
7. **Frequently Bought Together**: Evaluates co-occurrence scores.
8. **Trending**: Highlights popular and highly rated catalog items.
9. **Personalized For You**: Blends browsing history, rating signals, and category affinity.

*Note: The recommendation engine runs deterministically on the client/mock provider, demonstrating clean algorithmic scoring outside UI components.*

### 🤖 Rule-Based AI Shopping Assistant
An embedded, zero-cost conversational AI shopping assistant that operates without external API keys:
- **Intent Parsing & Normalization**: Extracts user intent (search, filter, compare, refine, add-to-cart).
- **Entity Extraction**: Recognizes categories, brand targets, price limits, color attributes, and ratings.
- **Structured Conversation State**: Tracks multi-turn dialogue history and refinements (e.g., *"Show me smartphones"* followed by *"Something cheaper"*).
- **Direct UI Bridge**: Enables direct cart additions, wishlist toggles, and rich product reference cards within chat.

### 🛠️ Admin Dashboard & Governance
- **Metrics Overview**: Revenue tracking, total order counts, average order values, and catalog inventory metrics.
- **Product Management**: CRUD dialogs for creating, editing, and deleting store inventory items.
- **Order Management**: Status workflow updates (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **Analytics & Instrumentation**: Real-time recommendation impression metrics and engine conversion analytics.

---

## 🛠️ Technology Stack

| Category | Technology | Version | Purpose / Notes |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | `16.3.6` | App Router, Server/Client Rendering |
| **UI Library** | React | `19.2.8` | Core Component Framework |
| **Language** | TypeScript | `^5.0.0` | Strict Static Typing & Schema Contracts |
| **Styling** | Tailwind CSS | `^4.0.0` | Utility-First CSS Framework |
| **State Management**| Zustand | `^5.0.15` | Reactive Store (Cart, Wishlist, Auth) |
| **Server State** | TanStack Query | `^5.104.0` | Data Fetching & Simple Cache |
| **Icons** | Lucide React | `^1.48.0` | Modern UI Vector Icons |
| **Unit/Integration**| Vitest | `5.0.2` | Component & Service Testing |
| **RTL** | Testing Library | `^16.3.3` | React DOM Component Testing |
| **E2E Testing** | Playwright | `^1.63.0` | End-to-End Browser Automation |
| **Deployment** | Vercel | `^61.0.0` | Next.js Production Cloud Hosting |

---

## 📂 Project Architecture

The repository enforces a strict, scalable feature-based folder structure:

```text
src/
├── app/                  # Next.js App Router pages and layouts
├── components/           # Shared UI & Accessibility components
├── features/             # Feature modules (auth, cart, products, admin, etc.)
│   ├── account/
│   ├── admin/
│   ├── ai-assistant/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── products/
│   ├── recommendations/
│   └── wishlist/
├── hooks/                # Custom React hooks (useAuth, useCart, useWishlist)
├── lib/                  # Utilities, auth sessions, and storage helpers
├── services/             # Service layers & Provider abstractions
│   ├── account/
│   ├── addresses/
│   ├── ai-assistant/
│   ├── api/
│   ├── mocks/
│   ├── orders/
│   ├── payment/
│   ├── products/
│   ├── recommendations/
│   └── reviews/
├── store/                # Zustand global state stores
└── types/                # TypeScript interface definitions & data contracts
```

For in-depth architectural details, refer to [`docs/architecture.md`](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/architecture.md).

---

## ⚡ Quick Start & Setup

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` or `v24.x`
- **npm**: `v10.x` or `v11.x`

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/dikshapatidar02/ShopSphere-AI.git
cd ShopSphere-AI

# 2. Install dependencies cleanly
npm install

# 3. Launch local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🧪 Testing & Validation

ShopSphere AI contains a comprehensive automated testing suite covering unit, integration, and E2E browser flows:

```bash
# Run TypeScript Type Checker
npx tsc --noEmit

# Run ESLint Audit
npm run lint

# Run Vitest Unit & Integration Suite
npm test

# Run Vitest Test Coverage Report
npm run test:coverage

# Run Playwright End-to-End E2E Tests
npm run test:e2e

# Run Next.js Production Turbopack Build
npm run build
```

---

## 📚 Technical Documentation Index

Detailed architectural specifications are available in the [`docs/`](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs) directory:

- 🏛️ [Architecture Specification](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/architecture.md)
- 🎯 [Recommendation Engine Architecture](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/recommendations.md)
- 🤖 [AI Shopping Assistant Guide](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/ai-assistant.md)
- 🔒 [Authentication & Session Control](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/authentication.md)
- 🧪 [Comprehensive Testing Documentation](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/testing.md)
- ♿ [Accessibility, Performance & Security](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/quality.md)
- 🔌 [API & Service Layer Guide](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/api.md)
- 🚀 [Deployment & Vercel Configuration](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/deployment.md)
- 📁 [Project Directory Structure](file:///c:/Users/initi/Desktop/ShopSphere%20AI/docs/project-structure.md)

---

## 📄 License & Attribution

Distributed under the MIT License. Built as a portfolio project showcasing enterprise frontend design patterns. Product data provided by [DummyJSON API](https://dummyjson.com/).

# ShopSphere AI — Data Contracts & API Integration

## Overview

ShopSphere AI integrates product catalog data from the public [DummyJSON API](https://dummyjson.com/) alongside local seed providers. All external API data is transformed into application domain models through mapper classes (`ProductMapper`).

---

## API Endpoints Utilized

| Endpoint | HTTP Method | Purpose | Application Layer Mapping |
| :--- | :--- | :--- | :--- |
| `/products` | `GET` | Fetches catalog products with pagination. | `ProductMapper.toDomain(apiProduct)` |
| `/products/search?q={query}`| `GET` | Executes full-text product search. | `ProductService.searchProducts(params)` |
| `/products/categories` | `GET` | Retrieves catalog category taxonomy. | `CategoryService.getCategories()` |
| `/products/category/{cat}` | `GET` | Filters catalog products by category. | `ProductService.getProductsByCategory()` |
| `/products/{id}` | `GET` | Fetches single product detail model. | `ProductService.getProductById(id)` |

---

## Provider Abstraction Architecture

```text
Product Service
      │
      ▼
IProductProvider (Interface)
      │
      ├───────────────────────┐
      ▼                       ▼
Mock Product Provider   HTTP API Provider
 (DummyJSON Seed Data)   (Production REST Endpoint)
```

- **Data Normalization**: Translates raw API responses into unified TypeScript schemas (`Product`, `Category`, `Review`).
- **Fallback Mechanisms**: If external network requests fail, the application seamlessly falls back to embedded local mock seeds.
- **Client Caching**: `SimpleCache` and `@tanstack/react-query` manage stale times to minimize duplicate remote network calls.

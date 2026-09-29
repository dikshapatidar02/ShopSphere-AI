# ShopSphere AI — Authentication & Session Governance

## Overview

ShopSphere AI implements a **JWT-compatible mock authentication and session management architecture**. Session state is managed globally via Zustand (`auth.store.ts`) and persisted securely in user-scoped browser storage.

> [!IMPORTANT]
> **Client-Side Authorization Boundary**:
> This application uses frontend-first mock authentication for demonstration and UI routing control. Client-side route guards prevent unauthenticated users from accessing customer and admin views, but do not replace server-side API authorization in production architectures.

---

## Session Model & User Roles

The authentication service supports two primary user roles:

```text
               ┌───────────────────────┐
               │    User Session       │
               └───────────┬───────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│     Customer Role       │ │       Admin Role        │
│ - Manage Cart/Wishlist  │ │ - View Admin Analytics  │
│ - Place Orders          │ │ - Product Inventory CRUD│
│ - Edit Profile/Addresses│ │ - Manage Order Workflows│
└─────────────────────────┘ └─────────────────────────┘
```

---

## Session Lifecycle & Persistence

1. **Registration & Login**:
   - Validates user email format and password strength.
   - Generates a mock JWT session token containing user payload (`id`, `email`, `name`, `role`, `expiresAt`).
2. **Session Persistence**:
   - Persists session tokens in `localStorage` under isolated session keys.
   - Automatically checks session token validity on application mount (`useAuth`).
3. **Session Expiration & Logout**:
   - Tokens automatically expire after 24 hours.
   - Logging out clears the active session token, resets user state, and clears user-scoped cart/wishlist stores.

---

## Protected Route Guards

Client-side route access is enforced via `ProtectedRoute` components:
- **Customer Protected Routes**: `/account/*`, `/checkout` (Redirects unauthenticated users to `/login?redirect=...`).
- **Admin Protected Routes**: `/admin/*` (Restricts non-admin users and displays `403 Access Denied` UI).

---

## User Data Isolation

Cart items, wishlist entries, addresses, and order histories are partitioned by active user ID (`session.user.id`), ensuring multi-user isolation across session switches.

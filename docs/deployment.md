# ShopSphere AI — Vercel Deployment & Build Architecture

## Overview

ShopSphere AI is deployed on **Vercel** using the **Next.js App Router Runtime**.

---

## Deployment Architecture

```text
GitHub Repository (dikshapatidar02/ShopSphere-AI)
       │
       ▼ (Branch: feature/deployment)
Vercel Cloud Build Pipeline
       │
       ├─► npm install (Clean exact-version lockfile resolution)
       ├─► npx tsc --noEmit (TypeScript type check)
       ├─► npm run build (Next.js Turbopack compilation)
       └─► Prerender 24 Static Pages + Dynamic Server Routes
       │
       ▼
Production HTTPS Live URL (https://shopsphere-ai.vercel.app)
```

---

## Exact Dependency Resolution Strategy

To ensure reproducible builds across Vercel cloud builders without `--legacy-peer-deps` or `--force`:
- **Vitest Stack Alignment**: Pinned `"vitest": "5.0.2"` and `"@vitest/coverage-v8": "5.0.2"` to exact matching versions in `package.json`.
- **Node Type Alignment**: Configured `"@types/node": "^22"` to satisfy peerOptional requirements across Vite 8, Vitest 5, and Next.js 16.
- **Lockfile Integrity**: Generated a clean `package-lock.json` validated via `npm ls` (0 peer dependency warnings).

---

## Manual Vercel CLI Deployment Commands

To trigger a manual preview or production deployment via the Vercel CLI:

```bash
# 1. Login to Vercel
npx vercel login

# 2. Deploy Preview Environment
npx vercel

# 3. Deploy Production Environment
npm run deploy  # Or: npx vercel --prod
```

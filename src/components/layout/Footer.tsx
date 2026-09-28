import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <p>© 2026 ShopSphere AI. All rights reserved. Advanced frontend-first intelligent e-commerce platform.</p>
        <div className="flex items-center gap-4">
          <Link href="/products" className="hover:underline">Catalog</Link>
          <Link href="/search" className="hover:underline">Search</Link>
          <span className="text-muted-foreground/60">Phase 05 — Product Discovery</span>
        </div>
      </div>
    </footer>
  );
}

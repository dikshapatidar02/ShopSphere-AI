import { Heart, RefreshCw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-slate-900 text-slate-300">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Free Express Delivery</h4>
                <p className="text-xs text-slate-400">On all orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secure Payment Guarantee</h4>
                <p className="text-xs text-slate-400">256-bit SSL encrypted checkout</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">30-Day Free Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free money back guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 AI Concierge</h4>
                <p className="text-xs text-slate-400">Instant shopping assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>ShopSphere <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">AI</span></span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Intelligent frontend-first e-commerce experience powered by multi-strategy recommendation scoring and conversational shopping assistance.
            </p>
          </div>

          {/* Quick Shop */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Shop Catalog</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products?category=smartphones" className="hover:text-white transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="hover:text-white transition-colors">Laptops & Tech</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-white transition-colors">Audio & Sound</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Search & Filter</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Customer Portal</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/account" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Technology</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built with Next.js 16 App Router, React 19, Tailwind CSS v4, Zustand, and TanStack Query.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1">
              <span>Crafted for portfolio showcase with</span>
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ShopSphere AI. Production Portfolio Demonstration Application.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-300">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

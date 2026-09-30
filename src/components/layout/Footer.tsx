import { Heart, RefreshCw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fast Order Processing</h4>
                <p className="text-xs text-slate-500 font-medium">Calculated checkout rates</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Secure Checkout</h4>
                <p className="text-xs text-slate-500 font-medium">Safe order experience</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Easy Order Management</h4>
                <p className="text-xs text-slate-500 font-medium">Track and manage purchases</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Shopping Assistant</h4>
                <p className="text-xs text-slate-500 font-medium">Instant catalog discovery</p>
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
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>ShopSphere <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-200">AI</span></span>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Intelligent e-commerce experience powered by multi-strategy recommendation scoring and conversational shopping assistance.
            </p>
          </div>

          {/* Quick Shop */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Shop Catalog</h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><Link href="/products" className="hover:text-blue-600 transition-colors">All Products</Link></li>
              <li><Link href="/products?category=smartphones" className="hover:text-blue-600 transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=laptops" className="hover:text-blue-600 transition-colors">Laptops & Tech</Link></li>
              <li><Link href="/products?category=audio" className="hover:text-blue-600 transition-colors">Audio & Sound</Link></li>
              <li><Link href="/search" className="hover:text-blue-600 transition-colors">Search & Filter</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Customer Portal</h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><Link href="/account" className="hover:text-blue-600 transition-colors">My Account</Link></li>
              <li><Link href="/orders" className="hover:text-blue-600 transition-colors">Order Tracking</Link></li>
              <li><Link href="/wishlist" className="hover:text-blue-600 transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-blue-600 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* System & Architecture */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Technology</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Built with Next.js 16 App Router, React 19, Tailwind CSS v4, Zustand, and TanStack Query.
            </p>
            <div className="pt-2 text-xs font-medium text-slate-600 flex items-center gap-1">
              <span>Crafted for portfolio showcase with</span>
              <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="mt-12 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 font-medium gap-4">
          <p>© {new Date().getFullYear()} ShopSphere AI. Production Portfolio Application.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-900">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-900">Terms of Service</Link>
            <Link href="/" className="hover:text-slate-900">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

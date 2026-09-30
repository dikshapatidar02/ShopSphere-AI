'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useWishlist } from '@/hooks/use-wishlist';
import { Heart, LogOut, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, summary } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearch && debouncedSearch.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearch.trim())}`, { scroll: false });
    }
  }, [debouncedSearch, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isAdmin = user?.role === 'administrator';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-slate-100 text-slate-800 border-b border-slate-200 text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2 max-w-full overflow-hidden">
        <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
        <span>Personalized AI E-Commerce Storefront • Use coupon code <strong className="text-slate-900 font-bold">SHOPSPHERE20</strong> for 20% OFF</span>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-slate-900 tracking-tight hover:opacity-95">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="flex items-center gap-1.5">
              ShopSphere
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                AI
              </span>
            </span>
          </Link>
        </div>

        {/* Global Store Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full h-10 pl-10 pr-10 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-none placeholder:text-slate-400 font-medium"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* User Account / Wishlist / Cart Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist (${wishlistCount} items)`}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Shopping Cart (${itemCount} items)`}
            className="relative flex items-center gap-2 h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[9px] font-black text-blue-700 shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">${summary.subtotal.toFixed(2)}</span>
          </Link>

          {/* User Profile / Admin Link */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                href={isAdmin ? '/admin' : '/account'}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-extrabold text-slate-800">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="h-3 w-3" /> Admin
                  </span>
                )}
              </Link>

              <button
                onClick={logout}
                title="Logout"
                aria-label="Logout"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/account"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-blue-500 transition-all bg-white"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Category Links Sub-Navigation */}
      <div className="hidden md:block border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex h-10 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-700">
          <Link href="/products" className="hover:text-blue-600 transition-colors">
            All Catalog
          </Link>
          <Link href="/products?category=smartphones" className="hover:text-blue-600 transition-colors">
            Smartphones
          </Link>
          <Link href="/products?category=laptops" className="hover:text-blue-600 transition-colors">
            Laptops
          </Link>
          <Link href="/products?category=audio" className="hover:text-blue-600 transition-colors">
            Audio & Sound
          </Link>
          <Link href="/products?category=wearables" className="hover:text-blue-600 transition-colors">
            Wearables
          </Link>
          <Link href="/search" className="hover:text-blue-600 transition-colors">
            Advanced Search
          </Link>
          {isAuthenticated && isAdmin && (
            <Link href="/admin" className="ml-auto text-blue-700 font-bold hover:underline flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin Portal
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-10 pr-4 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-medium placeholder:text-slate-400"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          </form>
          <nav className="flex flex-col space-y-1 text-sm font-semibold text-slate-800">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">
              Home
            </Link>
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">
              All Products
            </Link>
            <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">
              Search & Filters
            </Link>
            {isAuthenticated && (
              <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-slate-100">
                My Orders
              </Link>
            )}
            {isAuthenticated && isAdmin && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

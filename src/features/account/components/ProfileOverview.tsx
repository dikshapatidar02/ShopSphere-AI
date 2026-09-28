'use client';

import {
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  Package,
  Sparkles,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useAccount } from '../hooks/use-account';
import { AccountLoadingState } from './AccountLoadingState';

export function ProfileOverview() {
  const { user, overview, isLoading } = useAccount();

  if (isLoading || !overview) {
    return <AccountLoadingState />;
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: overview.ordersCount,
      label: 'View order history',
      href: '/account/orders',
      icon: Package,
    },
    {
      title: 'Wishlist Items',
      value: overview.wishlistCount,
      label: 'View saved items',
      href: '/account/wishlist',
      icon: Heart,
    },
    {
      title: 'Saved Addresses',
      value: overview.addressesCount,
      label: 'Manage shipping addresses',
      href: '/account/addresses',
      icon: MapPin,
    },
    {
      title: 'Recently Viewed',
      value: overview.recentlyViewedCount,
      label: 'View browsing history',
      href: '/account/recently-viewed',
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-xs">
        <h2 className="text-lg font-bold text-foreground sm:text-xl">
          Welcome back, {user?.name.split(' ')[0]}!
        </h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Manage your orders, profile details, shipping addresses, wishlist, and recommendations from your account hub.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-border bg-card p-4 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div>
                <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {card.value}
                </span>
                <p className="mt-1 text-[11px] text-muted-foreground group-hover:text-primary flex items-center gap-1">
                  <span>{card.label}</span>
                  <ArrowRight className="h-3 w-3" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Link
            href="/account/orders"
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all"
          >
            <Package className="h-4 w-4 text-primary" />
            <span>Track Orders</span>
          </Link>
          <Link
            href="/account/profile"
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all"
          >
            <User className="h-4 w-4 text-primary" />
            <span>Edit Profile</span>
          </Link>
          <Link
            href="/account/addresses"
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span>Add Address</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all"
          >
            <Heart className="h-4 w-4 text-rose-500" />
            <span>Wishlist</span>
          </Link>
          <Link
            href="/account/recommendations"
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Recommendations</span>
          </Link>
          <Link
            href="/account/recently-viewed"
            className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-xs font-semibold text-foreground hover:bg-accent hover:border-primary/40 transition-all"
          >
            <Clock className="h-4 w-4 text-primary" />
            <span>View History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

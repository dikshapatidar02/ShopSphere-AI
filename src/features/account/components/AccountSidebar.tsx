'use client';

import {
  Clock,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ACCOUNT_NAV_ITEMS = [
  { href: '/account', label: 'Overview', icon: LayoutDashboard },
  { href: '/account/profile', label: 'Profile', icon: User },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/account/recently-viewed', label: 'Recently Viewed', icon: Clock },
  { href: '/account/reviews', label: 'Reviews', icon: Star },
  { href: '/account/recommendations', label: 'Recommendations', icon: Sparkles },
  { href: '/account/preferences', label: 'Preferences', icon: Settings },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account sidebar navigation" className="w-full space-y-1">
      {ACCOUNT_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/account'
            ? pathname === '/account'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

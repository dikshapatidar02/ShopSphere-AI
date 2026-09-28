'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ACCOUNT_NAV_ITEMS } from './AccountSidebar';

export function AccountMobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex md:hidden overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
      <div className="flex items-center gap-1.5 min-w-max">
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
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

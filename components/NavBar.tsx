"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/clsx";
import { useI18n } from "@/lib/i18n-client";
import { useCart } from "@/store/cart";

export function NavBar() {
  const pathname = usePathname();
  const {
    locale,
    dict: { common },
  } = useI18n();

  const cartCount = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.qty, 0)
  );

  const navItems = [
    {
      key: "home",
      href: `/${locale}`,
      label: common.home,
      active: pathname === `/${locale}`,
    },
    {
      key: "catalog",
      href: `/${locale}/catalog`,
      label: common.catalog,
      active: pathname.startsWith(`/${locale}/catalog`),
    },
    {
      key: "cart",
      href: `/${locale}/cart`,
      label: common.cart,
      active: pathname.startsWith(`/${locale}/cart`),
    },
  ];

  const navStyle = {
    bottom: "1.25rem",
    "--pb-safe-base": "0.5rem",
  } as CSSProperties;

  return (
    <nav
      className="fixed left-1/2 z-[55] w-[92%] max-w-sm -translate-x-1/2 rounded-full border border-border bg-surface px-4 pt-2 pb-safe shadow-soft sm:bottom-6"
      style={navStyle}
    >
      <ul className="flex items-center justify-between text-sm font-medium text-mutedInk">
        {navItems.map((item) => (
          <li key={item.key} className="flex flex-1 justify-center">
            <Link
              href={item.href}
              className={cn(
                "relative flex h-12 w-full items-center justify-center rounded-full text-center leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                item.active ? "text-brand font-semibold" : "hover:text-ink"
              )}
            >
              {item.label}
              {item.key === "cart" && cartCount > 0 ? (
                <span className="absolute -top-1.5 right-4 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand text-xs font-semibold text-brandInk">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

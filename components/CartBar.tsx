"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/clsx";
import { useI18n } from "@/lib/i18n-client";
import { useCart } from "@/store/cart";

export function CartBar({ className }: { className?: string }) {
  const pathname = usePathname();
  const {
    locale,
    dict: { home: homeDict, common },
  } = useI18n();

  const itemCount = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.qty, 0)
  );

  if (itemCount === 0) {
    return null;
  }

  if (pathname.endsWith("/cart")) {
    return null;
  }

  const cartStyle = {
    bottom: "6.5rem",
    "--pb-safe-base": "1rem",
  } as CSSProperties;

  return (
    <Link
      href={`/${locale}/cart`}
      className={cn(
        "fixed left-1/2 z-[60] w-[92%] max-w-sm -translate-x-1/2 rounded-full bg-brand px-6 pt-4 pb-safe text-brandInk shadow-soft transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface ring-2 ring-[var(--brand-tint)] ring-offset-2 ring-offset-surface sm:bottom-6",
        className
      )}
      aria-label={common.goToCart}
      style={cartStyle}
    >
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="uppercase tracking-wide text-brandInk/80">
          {homeDict.miniCartLabel}
        </span>
        <span className="font-semibold text-brandInk">
          {itemCount} {common.pcs}
        </span>
      </div>
    </Link>
  );
}

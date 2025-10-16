"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/clsx";
import {
  LOCALES,
  translateCategorySlug,
  translateProductSlug,
  type Locale,
} from "@/data/catalog";
import { useI18n } from "@/lib/i18n-client";

function buildLocalizedPath(pathname: string, target: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${target}`;
  }

  const [, ...rest] = segments;
  const currentLocale = segments[0] as Locale;

  if (currentLocale === target) {
    return pathname || `/${currentLocale}`;
  }

  if (rest.length === 0) {
    return `/${target}`;
  }

  const [section, slug] = rest;

  if (section === "catalog" && slug) {
    const translated = translateCategorySlug(slug, currentLocale, target);
    if (translated) {
      return `/${target}/catalog/${translated}`;
    }
    return `/${target}/catalog`;
  }

  if (section === "product" && slug) {
    const translated = translateProductSlug(slug, currentLocale, target);
    if (translated) {
      return `/${target}/product/${translated}`;
    }
    return `/${target}/catalog`;
  }

  if (section === "cart") {
    return `/${target}/cart`;
  }

  if (section === "catalog") {
    return `/${target}/catalog`;
  }

  return `/${target}`;
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const pathname = usePathname();
  const {
    locale,
    dict: { footer },
  } = useI18n();

  const labels: Record<Locale, string> = {
    ru: footer.toggleRu,
    kk: footer.toggleKk,
  };

  return (
    <div className={cn("flex items-center gap-3 text-sm font-medium", className)}>
      {LOCALES.map((loc) => {
        const href = buildLocalizedPath(pathname || `/${locale}`, loc);
        const isActive = loc === locale;
        return (
          <Link
            key={loc}
            href={href}
            className={cn(
              "rounded-full border border-border px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
              isActive
                ? "bg-brand text-brandInk border-brand"
                : "bg-surface text-ink hover:bg-surface-alt"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {labels[loc]}
          </Link>
        );
      })}
    </div>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/clsx";
import { useI18n } from "@/lib/i18n-client";
import { useCatalogClient } from "@/lib/catalog-client-context";
import { LOCALES, type Locale } from "@/lib/locales";

function buildLocalizedPath(
  pathname: string,
  currentLocale: Locale,
  target: Locale,
  categorySlugMap: ReturnType<typeof useCatalogClient>["categorySlugMap"],
  productSlugMap: ReturnType<typeof useCatalogClient>["productSlugMap"],
  categoriesById: ReturnType<typeof useCatalogClient>["categoriesById"],
  productsById: ReturnType<typeof useCatalogClient>["productsById"]
): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return `/${target}`;
  }

  const [, ...rest] = segments;

  if (currentLocale === target) {
    return pathname || `/${currentLocale}`;
  }

  if (rest.length === 0) {
    return `/${target}`;
  }

  const [section, slug] = rest;

  if (section === "catalog" && slug) {
    const categoryId = categorySlugMap[currentLocale].get(slug);
    if (categoryId) {
      const targetCategory = categoriesById.get(categoryId);
      if (targetCategory) {
        return `/${target}/catalog/${targetCategory.slug[target]}`;
      }
    }
    return `/${target}/catalog`;
  }

  if (section === "product" && slug) {
    const productId = productSlugMap[currentLocale].get(slug);
    if (productId) {
      const targetProduct = productsById.get(productId);
      if (targetProduct) {
        return `/${target}/product/${targetProduct.slug[target]}`;
      }
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
  const {
    categorySlugMap,
    productSlugMap,
    categoriesById,
    productsById,
  } = useCatalogClient();

  const labels: Record<Locale, string> = {
    ru: footer.toggleRu,
    kk: footer.toggleKk,
  };

  return (
    <div className={cn("flex items-center gap-3 text-sm font-medium", className)}>
      {LOCALES.map((loc) => {
        const href = buildLocalizedPath(
          pathname || `/${locale}`,
          locale,
          loc,
          categorySlugMap,
          productSlugMap,
          categoriesById,
          productsById
        );
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

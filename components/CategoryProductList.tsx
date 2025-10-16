"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/clsx";
import { useI18n } from "@/lib/i18n-client";
import { ProductCard } from "@/components/ProductCard";

export type CategoryProduct = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  image: string;
  href: string;
  imageAlt: string;
  unoptimized?: boolean;
};

export function CategoryProductList({
  products,
  className,
}: {
  products: CategoryProduct[];
  className?: string;
}) {
  const {
    dict: { categoryPage },
  } = useI18n();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(normalized)
    );
  }, [products, query]);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <label className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3">
        <span className="text-sm font-medium text-mutedInk">
          {categoryPage.searchPlaceholder}
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={categoryPage.searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-mutedInk/70 focus:outline-none"
        />
      </label>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface-alt p-6 text-center text-sm text-mutedInk">
          {categoryPage.noResults}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
}

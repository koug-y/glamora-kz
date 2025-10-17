"use client";

import { createContext, useContext, useMemo } from "react";
import { LOCALES, type Locale } from "@/lib/locales";

export type CatalogClientCategory = {
  id: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
};

export type CatalogClientProduct = {
  id: string;
  categoryId: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  short: Record<Locale, string>;
  image: string | null;
};

export type CatalogClientPayload = {
  categories: CatalogClientCategory[];
  products: CatalogClientProduct[];
};

type CatalogClientValue = CatalogClientPayload & {
  categoriesById: Map<string, CatalogClientCategory>;
  productsById: Map<string, CatalogClientProduct>;
  categorySlugMap: Record<Locale, Map<string, string>>;
  productSlugMap: Record<Locale, Map<string, string>>;
};

const CatalogClientContext = createContext<CatalogClientValue | null>(null);

export function CatalogClientProvider({
  payload,
  children,
}: {
  payload: CatalogClientPayload;
  children: React.ReactNode;
}) {
  const value = useMemo<CatalogClientValue>(() => {
    const categoriesById = new Map<string, CatalogClientCategory>();
    const productsById = new Map<string, CatalogClientProduct>();
    const categorySlugMap: Record<Locale, Map<string, string>> = {
      ru: new Map(),
      kk: new Map(),
    };
    const productSlugMap: Record<Locale, Map<string, string>> = {
      ru: new Map(),
      kk: new Map(),
    };

    for (const category of payload.categories) {
      categoriesById.set(category.id, category);
      for (const locale of LOCALES) {
        categorySlugMap[locale].set(category.slug[locale], category.id);
      }
    }

    for (const product of payload.products) {
      productsById.set(product.id, product);
      for (const locale of LOCALES) {
        productSlugMap[locale].set(product.slug[locale], product.id);
      }
    }

    return {
      ...payload,
      categoriesById,
      productsById,
      categorySlugMap,
      productSlugMap,
    };
  }, [payload]);

  return (
    <CatalogClientContext.Provider value={value}>
      {children}
    </CatalogClientContext.Provider>
  );
}

export function useCatalogClient() {
  const value = useContext(CatalogClientContext);

  if (!value) {
    throw new Error("useCatalogClient must be used within CatalogClientProvider");
  }

  return value;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/data/i18n";
import { CategoryPill } from "@/components/CategoryPill";
import {
  getCategories,
  getProducts,
  sortCategoriesByLocale,
  DEFAULT_REVALIDATE_SECONDS,
} from "@/lib/catalog-fs";
import { LOCALES, type Locale } from "@/lib/locales";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

type PageParams = {
  params: { locale: string };
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const dict = getDict(locale);

  return {
    title: dict.seo.catalog.title,
    description: dict.seo.catalog.description,
    alternates: {
      canonical: `/${locale}/catalog`,
      languages: {
        ru: "/ru/catalog",
        kk: "/kk/catalog",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "kk_KZ",
      siteName: dict.common.brand,
      url: `/${locale}/catalog`,
      title: dict.seo.catalog.title,
      description: dict.seo.catalog.description,
    },
  };
}

export default async function CatalogPage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const dict = getDict(locale);
  const [categoriesRaw, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);
  const categories = sortCategoriesByLocale(categoriesRaw, locale);
  const populatedCategoryIds = new Set(
    products.map((product) => product.categoryId)
  );
  const visibleCategories = categories.filter((category) =>
    populatedCategoryIds.has(category.id)
  );

  if (visibleCategories.length === 0) {
    return (
      <section className="flex flex-col gap-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-ink">
            {dict.catalogPage.title}
          </h2>
          <p className="text-sm leading-relaxed text-mutedInk">
            {dict.catalogPage.subtitle}
          </p>
        </header>
        <p className="rounded-3xl border border-border bg-surface-alt p-6 text-sm text-mutedInk">
          {dict.catalogPage.empty}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-ink">
          {dict.catalogPage.title}
        </h2>
        <p className="text-sm leading-relaxed text-mutedInk">
          {dict.catalogPage.subtitle}
        </p>
      </header>
      <div className="flex flex-col gap-4">
        {visibleCategories.map((category) => (
          <CategoryPill
            key={category.id}
            href={`/${locale}/catalog/${category.slug[locale]}`}
            title={category.name[locale]}
            description={category.blurb[locale]}
          />
        ))}
      </div>
    </section>
  );
}

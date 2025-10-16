import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  LOCALES,
  type Locale,
  REVALIDATE,
  PRODUCTS,
} from "@/data/catalog";
import { getDict } from "@/data/i18n";
import { CategoryPill } from "@/components/CategoryPill";

export const revalidate = REVALIDATE;

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

export default function CatalogPage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const dict = getDict(locale);
  const populatedCategoryIds = new Set(PRODUCTS.map((product) => product.categoryId));
  const categoriesWithItems = CATEGORIES.filter((category) =>
    populatedCategoryIds.has(category.id)
  );
  const categoriesWithoutItems = CATEGORIES.filter(
    (category) => !populatedCategoryIds.has(category.id)
  );
  const orderedCategories = [...categoriesWithItems, ...categoriesWithoutItems];

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
        {orderedCategories.map((category) => (
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

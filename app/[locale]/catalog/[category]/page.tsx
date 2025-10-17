import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/data/i18n";
import { CategoryProductList } from "@/components/CategoryProductList";
import { getSafeImagePath } from "@/lib/safe-image";
import {
  getCategoryBySlug,
  getProductsByCategory,
  sortProductsByLocale,
  DEFAULT_REVALIDATE_SECONDS,
} from "@/lib/catalog-fs";
import { LOCALES, type Locale } from "@/lib/locales";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

type PageParams = {
  params: { locale: string; category: string };
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const category = await getCategoryBySlug(locale, params.category);

  if (!category) {
    notFound();
  }

  const dict = getDict(locale);
  const title = `${category.name[locale]} — ${dict.common.catalog} | ${dict.common.brand}`;
  const description = category.blurb[locale];

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/catalog/${category.slug[locale]}`,
      languages: {
        ru: `/ru/catalog/${category.slug.ru}`,
        kk: `/kk/catalog/${category.slug.kk}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "kk_KZ",
      siteName: dict.common.brand,
      url: `/${locale}/catalog/${category.slug[locale]}`,
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const category = await getCategoryBySlug(locale, params.category);

  if (!category) {
    notFound();
  }

  const dict = getDict(locale);
  const priceLabel = dict.common.priceCheck;
  const productsRaw = await getProductsByCategory(category.id);
  const products = sortProductsByLocale(productsRaw, locale).map((product) => {
    const image = getSafeImagePath(product.image ?? "");
    return {
      id: product.id,
      name: product.name[locale],
      description: product.short[locale],
      priceLabel,
      image,
      imageAlt: product.name[locale],
      href: `/${locale}/product/${product.slug[locale]}`,
      unoptimized: image.startsWith("data:"),
    };
  });

  return (
    <section className="flex flex-col gap-6 rounded-3xl bg-[#f3ebf0] px-5 py-6 sm:px-6 sm:py-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-mutedInk">
          {dict.catalogPage.title}
        </p>
        <h2 className="text-2xl font-semibold text-ink">
          {category.name[locale]}
        </h2>
        <p className="text-sm leading-relaxed text-mutedInk">
          {category.blurb[locale]}
        </p>
      </header>
      {products.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-border bg-surface-alt p-6 text-center text-sm text-mutedInk">
          {dict.catalogPage.empty}
        </p>
      ) : (
        <CategoryProductList products={products} />
      )}
    </section>
  );
}

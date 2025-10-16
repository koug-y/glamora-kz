import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  LOCALES,
  type Locale,
  REVALIDATE,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/data/catalog";
import { getDict } from "@/data/i18n";
import { CategoryProductList } from "@/components/CategoryProductList";
import { getSafeImagePath } from "@/lib/safe-image";

export const revalidate = REVALIDATE;

type PageParams = {
  params: { locale: string; category: string };
};

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CATEGORIES.map((category) => ({
      locale,
      category: category.slug[locale],
    }))
  );
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const category = getCategoryBySlug(locale, params.category);

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

export default function CategoryPage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const category = getCategoryBySlug(locale, params.category);

  if (!category) {
    notFound();
  }

  const dict = getDict(locale);
  const priceLabel = dict.common.priceCheck;
  const products = getProductsByCategory(category.id).map((product) => {
    const image = getSafeImagePath(product.image);
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
      <CategoryProductList products={products} />
    </section>
  );
}

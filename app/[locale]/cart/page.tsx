import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/data/i18n";
import { CartView } from "@/components/CartView";
import { LOCALES, type Locale } from "@/lib/locales";
import { DEFAULT_REVALIDATE_SECONDS } from "@/lib/catalog-fs";

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
    title: dict.seo.cart.title,
    description: dict.seo.cart.description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}/cart`,
      languages: {
        ru: "/ru/cart",
        kk: "/kk/cart",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "kk_KZ",
      siteName: dict.common.brand,
      url: `/${locale}/cart`,
      title: dict.seo.cart.title,
      description: dict.seo.cart.description,
    },
  };
}

export default function CartPage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const dict = getDict(locale);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-ink">
          {dict.cartPage.title}
        </h1>
      </header>
      <CartView locale={locale} />
    </section>
  );
}

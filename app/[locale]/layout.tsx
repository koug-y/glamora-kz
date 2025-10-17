import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/data/i18n";
import { I18nProvider } from "@/lib/i18n-client";
import { NavBar } from "@/components/NavBar";
import { CartBar } from "@/components/CartBar";
import { OWNER_PHONE, hasOwnerPhone } from "@/lib/whatsapp";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";
import {
  getCategories,
  getProducts,
  DEFAULT_REVALIDATE_SECONDS,
} from "@/lib/catalog-fs";
import {
  CatalogClientProvider,
  type CatalogClientPayload,
} from "@/lib/catalog-client-context";
import { LOCALES, type Locale } from "@/lib/locales";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

async function buildCatalogPayload(): Promise<CatalogClientPayload> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return {
    categories: categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name,
      blurb: category.blurb,
    })),
    products: products.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      slug: product.slug,
      name: product.name,
      short: product.short,
      image: product.image,
    })),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const dict = getDict(locale);
  const ownerPhoneAvailable = hasOwnerPhone();
  const catalogPayload = await buildCatalogPayload();

  return (
    <CatalogClientProvider payload={catalogPayload}>
      <I18nProvider locale={locale} dict={dict}>
        <HtmlLangSetter />
        <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col bg-surface pb-[calc(140px+env(safe-area-inset-bottom))] pt-6 sm:pb-32">
          <header className="flex items-start justify-between px-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm uppercase tracking-wide text-mutedInk">
                {dict.common.city}
              </span>
              <h1 className="text-2xl font-semibold text-ink">
                {dict.common.brand}
              </h1>
            </div>
          </header>
          <main className="flex-1 px-4 py-6">{children}</main>
          <footer className="mt-8 px-4 pb-12 text-sm text-mutedInk">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-base font-semibold text-ink">
                  {dict.common.brand}
                </p>
                <p className="uppercase tracking-wide">{dict.common.city}</p>
              </div>
              <p>{dict.footer.legal}</p>
              {ownerPhoneAvailable ? (
                <Link
                  href={`https://wa.me/${OWNER_PHONE}`}
                  className="w-fit font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dict.footer.whatsapp}
                </Link>
              ) : (
                <p className="w-fit text-sm text-mutedInk">
                  {dict.common.whatsappUnavailable}
                </p>
              )}
              <LocaleSwitcher className="pt-2" />
            </div>
          </footer>
          <CartBar />
          <NavBar />
        </div>
      </I18nProvider>
    </CatalogClientProvider>
  );
}

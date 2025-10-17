import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDict } from "@/data/i18n";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { getSafeImagePath, PLACEHOLDER_IMAGE_DATA } from "@/lib/safe-image";
import {
  getProductBySlug,
  DEFAULT_REVALIDATE_SECONDS,
} from "@/lib/catalog-fs";
import { LOCALES, type Locale } from "@/lib/locales";

export const revalidate = DEFAULT_REVALIDATE_SECONDS;

type PageParams = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const product = await getProductBySlug(locale, params.slug);

  if (!product) {
    notFound();
  }

  const fallbackTitle = `${product.name[locale]} | glamora_kz`;
  const title = product.seo?.[locale]?.title ?? fallbackTitle;
  const description =
    product.seo?.[locale]?.desc ?? product.short[locale] ?? "";
  const primaryImage = getSafeImagePath(product.image ?? "");
  const ogImage = primaryImage.startsWith("data:")
    ? "/pictures/glamora_logo.jpg"
    : primaryImage;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/product/${product.slug[locale]}`,
      languages: {
        ru: `/ru/product/${product.slug.ru}`,
        kk: `/kk/product/${product.slug.kk}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "kk_KZ",
      siteName: "glamora_kz",
      url: `/${locale}/product/${product.slug[locale]}`,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 800,
          height: 800,
          alt: product.name[locale],
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const product = await getProductBySlug(locale, params.slug);

  if (!product) {
    notFound();
  }

  const dict = getDict(locale);
  const cartHref = `/${locale}/cart`;
  const images = product.images.length
    ? product.images.map((src: string) => getSafeImagePath(src))
    : [PLACEHOLDER_IMAGE_DATA];
  const primaryImage = getSafeImagePath(product.image ?? "");

  const isSingleImage = images.length === 1;

  return (
    <article className="flex flex-col gap-8">
      <div className="space-y-4">
        {isSingleImage ? (
          <div className="flex justify-center">
            <div className="relative h-72 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface-alt">
              <Image
                src={images[0]}
                alt={product.name[locale]}
                fill
                sizes="(min-width: 640px) 320px, 100vw"
                className="object-contain"
                unoptimized={images[0].startsWith("data:")}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((src: string, index: number) => (
              <div
                key={src + index}
                className="relative h-72 w-full overflow-hidden rounded-3xl border border-border bg-surface-alt"
              >
                <Image
                  src={src}
                  alt={product.name[locale]}
                  fill
                  sizes="(min-width: 640px) 320px, 100vw"
                  className="object-contain"
                  unoptimized={src.startsWith("data:")}
                />
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-ink">
            {product.name[locale]}
          </h1>
          <p className="text-base text-mutedInk">{product.short[locale]}</p>
          <div className="flex items-center justify-between text-sm text-mutedInk">
            <span>{dict.common.price}</span>
            <span className="font-medium text-mutedInk">
              {dict.common.priceCheck}
            </span>
          </div>
          {product.volume ? (
            <div className="flex items-center justify-between text-sm text-mutedInk">
              <span>{dict.common.volume}</span>
              <span className="font-medium text-ink">{product.volume}</span>
            </div>
          ) : null}
        </div>
        <ProductPurchasePanel
          product={{
            id: product.id,
            name: product.name[locale],
            price: product.price,
            image: primaryImage,
            locale,
          }}
          cartHref={cartHref}
        />
      </div>

      <section className="space-y-6">
        <div className="space-y-2 rounded-3xl border border-border bg-surface-alt p-4">
          <h2 className="text-lg font-semibold text-ink">
            {dict.productPage.description}
          </h2>
          <p className="text-sm leading-relaxed text-mutedInk">
            {product.description[locale]}
          </p>
        </div>
      </section>
    </article>
  );
}

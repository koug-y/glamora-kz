import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict } from "@/data/i18n";
import { LandingActions } from "@/components/LandingActions";
import { getSafeImagePath } from "@/lib/safe-image";
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
    title: dict.seo.home.title,
    description: dict.seo.home.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ru: "/ru",
        kk: "/kk",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "kk_KZ",
      siteName: dict.common.brand,
      url: `/${locale}`,
      title: dict.seo.home.title,
      description: dict.seo.home.description,
      images: [
        {
          url: "/pictures/glamora_logo.jpg",
          width: 800,
          height: 600,
          alt: dict.common.brand,
        },
      ],
    },
  };
}

export default function LocaleHomePage({ params }: PageParams) {
  const locale = params.locale as Locale;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  const dict = getDict(locale);
  const logoSrc = getSafeImagePath("/pictures/glamora_logo.jpg");
  const isPlaceholder = logoSrc.startsWith("data:");

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border border-border shadow-soft">
          <Image
            src={logoSrc}
            alt="glamora_kz logo"
            fill
            sizes="112px"
            className="object-cover"
            unoptimized={isPlaceholder}
          />
        </div>
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wider text-mutedInk">
            {dict.home.heroTitle}
          </p>
          <h2 className="text-2xl font-semibold text-ink">
            {dict.common.brand}
          </h2>
          <div className="space-y-2 text-base font-medium leading-relaxed text-mutedInk">
            {dict.home.heroTaglineLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <LandingActions catalogHref={`/${locale}/catalog`} />
    </section>
  );
}

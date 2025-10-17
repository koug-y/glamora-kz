import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/base-url";
import { isNoindexSegment } from "@/lib/seo";
import { getCategories, getProducts } from "@/lib/catalog-fs";
import { LOCALES } from "@/lib/locales";

const BASE_URL = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  for (const locale of LOCALES) {
    urls.push(
      ...STATIC_SEGMENTS.filter((segment) => {
        return !segment || !isNoindexSegment(segment);
      }).map((segment) => ({
        url: segment
          ? `${BASE_URL}/${locale}/${segment}`
          : `${BASE_URL}/${locale}`,
        lastModified: now,
      }))
    );

    for (const category of categories) {
      urls.push({
        url: `${BASE_URL}/${locale}/catalog/${category.slug[locale]}`,
        lastModified: now,
      });
    }

    for (const product of products) {
      urls.push({
        url: `${BASE_URL}/${locale}/product/${product.slug[locale]}`,
        lastModified: now,
      });
    }
  }

  return urls;
}

const STATIC_SEGMENTS = ["", "catalog", "cart"] as const;

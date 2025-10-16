import type { MetadataRoute } from "next";
import {
  CATEGORIES,
  LOCALES,
  PRODUCTS,
} from "@/data/catalog";
import { getBaseUrl } from "@/lib/base-url";
import { isNoindexSegment } from "@/lib/seo";

const BASE_URL = getBaseUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

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

    for (const category of CATEGORIES) {
      urls.push({
        url: `${BASE_URL}/${locale}/catalog/${category.slug[locale]}`,
        lastModified: now,
      });
    }

    for (const product of PRODUCTS) {
      urls.push({
        url: `${BASE_URL}/${locale}/product/${product.slug[locale]}`,
        lastModified: now,
      });
    }
  }

  return urls;
}

const STATIC_SEGMENTS = ["", "catalog", "cart"] as const;

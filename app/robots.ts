import type { MetadataRoute } from "next";
import { LOCALES } from "@/data/catalog";
import { getBaseUrl } from "@/lib/base-url";
import { buildNoindexPaths } from "@/lib/seo";

const BASE_URL = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
  const disallow = buildNoindexPaths(LOCALES);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

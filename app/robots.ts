import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/base-url";
import { buildNoindexPaths } from "@/lib/seo";
import { LOCALES } from "@/lib/locales";

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

const NOINDEX_SEGMENTS = ["cart", "whatsapp"] as const;

type NoindexSegment = (typeof NOINDEX_SEGMENTS)[number];

const NOINDEX_SEGMENT_SET = new Set<string>(NOINDEX_SEGMENTS);

/**
 * Whether a top-level segment should be omitted from SEO surfaces like sitemaps.
 */
export function isNoindexSegment(segment: string): segment is NoindexSegment {
  return NOINDEX_SEGMENT_SET.has(segment);
}

/**
 * Produce absolute path patterns that crawlers should avoid.
 * Includes bare routes (e.g. `/cart`) and per-locale paths (e.g. `/ru/cart`).
 */
export function buildNoindexPaths(locales: readonly string[]): string[] {
  const paths = new Set<string>();

  for (const segment of NOINDEX_SEGMENTS) {
    paths.add(`/${segment}`);

    for (const locale of locales) {
      paths.add(`/${locale}/${segment}`);
    }
  }

  return Array.from(paths);
}

export { NOINDEX_SEGMENTS };

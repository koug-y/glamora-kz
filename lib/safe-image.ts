import { existsSync } from "node:fs";
import { join } from "node:path";

const WARNED_IMAGES = new Set<string>();

export const PLACEHOLDER_IMAGE_DATA = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="placeholder"><rect width="120" height="120" fill="#fafafb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#c9a090">glamora</text></svg>`
).toString("base64")}`;

export function getSafeImagePath(src: string): string {
  if (!src) {
    return PLACEHOLDER_IMAGE_DATA;
  }

  if (src.startsWith("data:") || src.startsWith("http")) {
    return src;
  }

  if (src.startsWith("/assets/")) {
    return src;
  }

  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  const absolutePath = join(process.cwd(), "public", cleanSrc);

  if (existsSync(absolutePath)) {
    return src;
  }

  if (!WARNED_IMAGES.has(src)) {
    console.warn(
      `[glamora_kz] Missing image asset "${src}". Falling back to placeholder.`
    );
    WARNED_IMAGES.add(src);
  }

  return PLACEHOLDER_IMAGE_DATA;
}

export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!raw) {
    throw new Error(
      "[glamora_kz] NEXT_PUBLIC_SITE_URL is required for sitemap/robots"
    );
  }

  return raw.replace(/\/$/, "");
}

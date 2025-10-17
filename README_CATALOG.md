# Catalog Hub Guide

Non-developers can manage categories, products, and images by editing the `/catalog` folder. No code changes or rebuilds are required—Next.js reads the folder contents at runtime.

## Folder Structure

```
/catalog/
  category_<categoryId>/
    _category_info.json        (optional)
    product_<productId>/
      product_<productId>_info.json
      product_<productId>_photo.png
      product_<productId>_photo-2.png
```

- `category_<categoryId>` — lowercase ASCII ID with dashes (e.g. `category_creams`).
- `_category_info.json` — optional metadata file. If omitted, the loader falls back to the folder ID for names and slugs.
- `product_<productId>` — lowercase ASCII ID with dashes (e.g. `product_light-cream-30ml`).
- Image names must start with `product_<productId>_photo`. Any image extension (`png`, `jpg`, `jpeg`, `webp`, `gif`) is supported.

## Adding a Category

1. Create a new folder `catalog/category_<id>` (e.g. `category_toners`).
2. (Recommended) Add `_category_info.json` with localized copy:

```json
{
  "id": "toners",
  "slug": { "ru": "tonery", "kk": "tonerler" },
  "name": { "ru": "Тонеры", "kk": "Тонерлер" },
  "blurb": {
    "ru": "Мягкие тонеры для подготовки кожи.",
    "kk": "Теріні дайындайтын жұмсақ тонерлер."
  },
  "order": 200
}
```

- `order` controls sort priority (lower numbers first). Omit to fall back to alphabetical order by name.
- Any missing locale field falls back to the raw ID.

3. Add at least one product folder inside (see below). Categories without products are hidden from the catalog page.

## Adding a Product

1. Inside the category, create `product_<id>` (e.g. `product_light-cream-30ml`).
2. Add `product_<id>_info.json` using this template:

```json
{
  "id": "light-cream-30ml",
  "categoryId": "creams",
  "slug": {
    "ru": "legkiy-krem-30ml",
    "kk": "jenil-krem-30ml"
  },
  "name": {
    "ru": "Лёгкий крем 30 мл",
    "kk": "Жеңіл крем 30 мл"
  },
  "short": {
    "ru": "Лёгкая текстура для быстрого увлажнения.",
    "kk": "Жылдам ылғалдандыратын жеңіл текстура."
  },
  "description": {
    "ru": "Подробное описание на русском.",
    "kk": "Қазақша толық сипаттама."
  },
  "price": 12900,
  "currency": "KZT",
  "volume": "30 мл",
  "seo": {
    "ru": { "title": "Лёгкий крем 30 мл", "desc": "Ежедневный увлажняющий крем" },
    "kk": { "title": "Жеңіл крем 30 мл", "desc": "Күнделікті ылғалдандырғыш" }
  },
  "images": [
    "product_light-cream-30ml_photo.png",
    "product_light-cream-30ml_photo-2.png"
  ]
}
```

3. Drop product images next to the JSON file. If the `images` array is omitted, the loader automatically collects every file matching `product_<id>_photo*.ext`.
4. Save the files. The storefront will surface the new product on the next revalidation.

## Naming Rules

- IDs: lowercase, ASCII, dashes only (`light-cream-30ml`).
- Filenames must mirror IDs: `product_<productId>_info.json`, `product_<productId>_photo.png`.
- Localized fields (`slug`, `name`, `short`, `description`, `blurb`, `seo`) must include both `ru` and `kk` keys.
- Prices are numeric (in KZT) and still hidden in the UI; customers are prompted to confirm with the seller.

## Images

- Use PNG/JPG/WebP/GIF. Keep file sizes lean for faster loading.
- The first listed image (or alphabetically first `product_<id>_photo*`) becomes the product Card and hero image.
- Missing or unreadable files fall back to a neutral SVG placeholder—check the terminal for warnings during `npm run dev`.

## Caching & Refresh

- Production pages revalidate every **60 seconds**. New or edited products appear automatically after the next revalidation window.
- During local development (`npm run dev`), changes are picked up immediately after refreshing the browser.
- Run `npm run validate:catalog` to lint the catalog structure and JSON before committing.
- The automated test suite (`npm run test`) covers loader edge cases; run it after bulk edits.

## Refactor Change Log

- Consolidated all catalog data into this hub and wired every storefront page to load categories/products via `lib/catalog-fs.ts`—no static arrays remain in code.
- Added strict Zod schemas for `_category_info.json` and `product_*_info.json`, including ID/slug validation, image discovery, and locale fallbacks.
- Created the `/assets/[...path]` route so product imagery lives beside JSON files and is served with traversal protections and ISR-aware headers.
- Reduced the product gallery to a single centered hero frame when only one image is present; additional images still render in a responsive grid if supplied.
- Delivered helper tooling: `scripts/validate-catalog.ts`, Vitest suites for loader/page behavior, and Playwright-ready guidance for manual smoke tests.
- Shipped the sample `category_creams` folder with `product_light-cream-30ml` and `product_dark-cream-50ml`, each containing `_info.json` plus a PNG placeholder.

## Cache Cooldown Controls

- By default, `DEFAULT_REVALIDATE_SECONDS = 60` governs ISR for catalog, category, product, and cart routes as well as the `/assets` handler.
- The loader’s `getCatalogData` bypasses the cache in development so non-developers see instant feedback while editing JSON/images.
- To restore the 60-second cooldown everywhere:
  1. Open `lib/catalog-fs.ts`.
  2. Find `async function getCatalogData(...)`.
  3. Remove the `process.env.NODE_ENV === "development"` check from the early return so only the explicit `{ fresh: true }` flag skips caching.
  4. Restart `npm run dev` (or rebuild) to apply the change.
- Keep the `{ fresh: true }` option for validation scripts and tests that must read the filesystem directly without caches.
- If changes ever appear stale in development, stop `npm run dev`, clear `.next/cache`, and restart; the loader re-hydrates directly from the filesystem on boot.

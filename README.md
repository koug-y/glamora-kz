# glamora_kz storefront

Localized storefront for glamora_kz, a Korean skincare mini-shop in Almaty. The site serves Russian and Kazakh audiences, showcases curated products with rich descriptions, and streamlines WhatsApp-based ordering. Recent updates remove fixed prices in favor of seller-contact prompts and surface populated catalog sections first.

## Prerequisites

- Node.js 18.17+ (or Node 20 LTS)
- npm 9+

## Features

- Locale-aware routing with `/ru` and `/kk` sections for home, catalog, product, and cart flows.
- File-based catalog hub (`/catalog`) loaded at runtime via `lib/catalog-fs.ts` with Zod validation, localized slugs, image discovery, and price-hidden messaging.
- Persisted cart powered by Zustand, surfaced in the bottom nav, sticky mini-cart, and cart page with contact-for-price copy.
- Contextual cart CTA feedback: adds button confirmation copy per locale and a light pink mini-cart outline to match glamora_kz styling.
- Automated WhatsApp deep links for quick consults or pre-filled order summaries that echo the seller-contact instruction.
- Static metadata, sitemap, and robots exports tailored per locale for better SEO.

## Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) with custom design tokens
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) for cart state persistence

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 and you will be redirected to `/ru`. Switch locales with the footer toggle to browse `/kk`.

## Scripts

- `npm run dev` – start local dev server
- `npm run build` – build for production
- `npm run start` – run the production build
- `npm run lint` – run ESLint
- `npm run validate:catalog` – validate the catalog hub structure with Zod

## Deployment

- Production hosting runs on Vercel (`koug-ys-projects/glamora-kz`), connected to this GitHub repo.
- Pushing to the `main` branch kicks off an automatic production deployment; no manual CLI deploy is required for routine updates.
- `vercel.json` pins the Next.js build step so Vercel always uses the Next.js runtime instead of static output.
- Day-to-day flow: make your changes locally, run `git commit`, then `git push origin main`; Vercel picks up the push and rebuilds production.
- To observe deployments, open the Vercel dashboard (Project → Deployments) or run `npx vercel list glamora-kz`.
- If you do need an ad-hoc deploy, `npx vercel --prod` still works, but the Git-based flow is the source of truth.

## Project Structure

- `app/` – Next.js App Router pages, layouts, sitemap, and robots metadata.
- `components/` – UI building blocks (navigation, cart, catalog cards, CTA buttons) now reflect locale “contact for price” messaging and product detail cards centered on the description.
- `catalog/` – Filesystem hub of categories/products editable by non-developers.
- `data/` – Locale dictionaries (`data/i18n.ts`).
- `lib/` – Utilities for formatting, i18n context, WhatsApp links, safe image handling, catalog FS loader, and base URL resolution.
- `store/` – Zustand cart store persisted to `localStorage`.
- `app/assets/` – Route handler streaming catalog images without duplicating them under `public/`.

## Key Flows

- **Adding to cart** – `components/ProductPurchasePanel.tsx` manages quantity selection and adds products via the Zustand cart store. After adding an item the primary CTA swaps to a locale-specific success message for ~2.5 seconds, and cart rows always surface product names translated to the active locale.
- **Mini-cart and navigation** – `components/CartBar.tsx` floats above the bottom nav with a brand-tint outline so users always have a path back to the cart. The bottom nav (`components/NavBar.tsx`) mirrors the cart count.
- **Cart management** – `components/CartView.tsx` uses the shared `QtyStepper` for quantity updates, persists changes through the store, and routes customers to WhatsApp with pre-filled order summaries.
- **WhatsApp deep links** – `lib/whatsapp.ts` assembles locale-aware consult and checkout messages using the selected cart items.

## Internationalization

Translations live in `data/i18n.ts`; localized names and slugs are sourced from the catalog loader. The `LocaleSwitcher` component rewrites URLs across locales using the live slug map provided by `CatalogClientProvider`.

## WhatsApp Ordering

`lib/whatsapp.ts` composes shareable order messages. Button actions throughout the app direct users to WhatsApp with either quick consult text or cart-based summaries, including a form-like prompt for contact details and localized “contact for price” reminder. Totals are intentionally omitted in WhatsApp payloads so the seller can quote prices manually. Components call `hasOwnerPhone()` before linking out; if the env is missing (e.g., during debugging) the UI swaps to a localized fallback message rather than emitting dead links.

## Configuration

- Base URL for sitemap/robots:
  - `NEXT_PUBLIC_SITE_URL` **must** be set (build fails otherwise). Provide the canonical origin, e.g. `https://glamora.kz`.
  - Example `.env.local`:
    
    ```bash
    NEXT_PUBLIC_SITE_URL=https://your-domain.com
    NEXT_PUBLIC_WHATSAPP_NUMBER=77712248250
    ```

- WhatsApp phone number:
- Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the WhatsApp number the storefront should use (digits only; `+` or spaces are stripped automatically). Current production value: `77712248250`.
  - Builds will fail if the env var is missing or malformed, preventing previews from pinging production numbers. If you temporarily bypass the guard, the UI renders fallback copy instead of broken links.
  - Used by the footer link and all WhatsApp deep links.

- Default locale and document language:
  - The landing redirects to `/ru` in `app/page.tsx`.
  - The `<html lang>` attribute updates on the client after hydration to match the active locale via `components/HtmlLangSetter.tsx`.
  - Note: For SSR, the root `app/layout.tsx` still renders `lang="ru"`; bots and screen readers see the correct lang after hydration. If you need SSR-correct `lang`, consider a middleware-driven approach instead of the client patch.

- Revalidation / ISR:
  - Pages and asset routes share `DEFAULT_REVALIDATE_SECONDS = 60`.
  - Adding or editing files under `/catalog` is picked up automatically after the next revalidation window.

- Cart persistence:
  - Cart is stored in `localStorage` under key `glamora_cart_v1` (`store/cart.ts`).
  - Bumping the version resets existing client carts.

## Data Model and Content

- `/catalog/category_<id>/` – category folder. Optional `_category_info.json` overrides localized `slug`, `name`, `blurb`, and `order`. Missing fields fall back to the folder ID.
- `/catalog/category_<id>/product_<id>/` – product folder with `product_<id>_info.json` (see `README_CATALOG.md`) and image files (`product_<id>_photo.png`, `product_<id>_photo-2.png`, ...).
- `lib/catalog-fs.ts` walks the hub, validates JSON with Zod, infers missing images, deduplicates IDs/slugs, and exposes helpers consumed by pages and the client catalog context.
- Images stay beside their product JSON and are served via `/assets/<category>/<product>/<file>`; anything missing falls back to an inline SVG placeholder.

## Styling / Branding

- Design tokens live in `app/globals.css` (`--brand`, `--brand-ink`, `--brand-tint`, `--ink`, etc.).
- Inter font is configured in `app/layout.tsx` via `next/font/google`.
- Tailwind customization is in `tailwind.config.ts` (container, colors, radius, shadows, fonts).
- Bottom-fixed nav and cart bars use the `.pb-safe` utility (`padding-bottom: calc(var(--pb-safe-base, 0px) + env(safe-area-inset-bottom))`) so they respect mobile safe areas without drifting higher on iOS.

## Deployment Notes

- `app/sitemap.ts` and `app/robots.ts` respect `NEXT_PUBLIC_SITE_URL` to emit absolute URLs.
- Incremental static regeneration runs every 60 seconds; edits to `/catalog` propagate on the next revalidation.

### Vercel

- Add `NEXT_PUBLIC_SITE_URL` in Project → Settings → Environment Variables.
- Deploy; ISR respects the configured revalidation interval.

### Self-hosted Node

- `npm run build` then `npm run start`.
- Ensure `NEXT_PUBLIC_SITE_URL` is present in the runtime environment.

## Troubleshooting

- Placeholder images: If a neutral placeholder shows, drop the correctly named `product_<id>_photo*.png` into the matching product folder under `/catalog`.
- Locale switch drops to `/catalog`: Ensure both locale slugs are present for the category/product.
- Cart not persisting: The storage key/version may have changed; see `store/cart.ts`.
- Next.js SWC fails to load on macOS: Gatekeeper may quarantine the binary. Clear the attribute and restart dev:

  ```bash
  xattr -dr com.apple.quarantine node_modules/@next/swc-darwin-arm64
  npm run dev
  ```

## Known Limitations

- Prices are hidden and totals are omitted in WA payloads by design; customers confirm price with the seller.
- No server-side order handling; checkout is via WhatsApp only.
- Cart is device-local (no account sync across devices).

Feel free to adjust catalog data or translations in `data/` and drop new product folders/images into `/catalog/`.

## Filesystem Catalog Refactor Overview

### Work Completed
- Introduced the filesystem-driven catalog hub under `/catalog` with environment-configurable root (`CATALOG_DIR`) and removed all hard-coded product/category arrays.
- Built `lib/catalog-fs.ts` to validate hub JSON with Zod, enforce ID/slug uniqueness, auto-discover product images, and expose locale-aware helpers consumed by catalog, category, product, and cart flows.
- Added the `/assets/[...path]` route handler to stream catalog images (and other hub files) directly with MIME detection, traversal guards, and shared ISR settings.
- Reworked `app/[locale]/catalog`, `app/[locale]/catalog/[category]`, and `app/[locale]/product/[slug]` pages to use the loader results, hide empty categories, center the single product image case, and streamline product details down to the main description.
- Supplied non-developer tooling: sample `catalog/category_creams/...` content, `scripts/validate-catalog.ts`, and updated documentation so catalog edits require file changes only.
- Tidied supporting code: removed the stray `"use server"` directive from the loader module, aligned cache exports via `DEFAULT_REVALIDATE_SECONDS`, and refreshed catalogs to default to one centered hero image per product.

### Development & Testing Notes
- Local development (`npm run dev`) now shares the same 60-second incremental cache window as production; pass `{ fresh: true }` to catalog helpers in scripts/tests when you explicitly need uncached data.
- `npm run validate:catalog` exercises the loader without caching, surfaces schema errors, and warns when categories lack products.

### 60-second Catalog Cooldown
- `DEFAULT_REVALIDATE_SECONDS = 60` is enforced for catalog data in every environment through `unstable_cache`.
- Loader helpers accept `{ fresh: true }` if you need to bypass caching for ad-hoc scripts, tooling, or tests.
- During local iteration, either wait out the 60-second window, call the helper with `fresh: true`, or restart `npm run dev` to pick up immediate catalog changes.

## Deployment Log (2025-10-16)

- Linked the repo to Vercel project `koug-ys-projects/korean4` via `vercel link --yes`, which generated `.vercel/project.json`.
- Added environment variables with the CLI: `NEXT_PUBLIC_WHATSAPP_NUMBER=77712248250` and `NEXT_PUBLIC_SITE_URL=https://korean4.vercel.app` for both preview and production targets.
- Addressed the sitemap/robots build failure by ensuring `NEXT_PUBLIC_SITE_URL` was present before redeploying.
- Created preview deployments (`vercel --yes`) resulting in `https://korean4-lbb7habe8-koug-ys-projects.vercel.app` and `https://korean4-28aetofd2-koug-ys-projects.vercel.app`, then promoted to production with `vercel --prod --yes` (`https://korean4.vercel.app`).
- Worked around Vercel’s Git author restriction by temporarily renaming `.git/` during deploys; configure Git author email to a permitted account to remove this step.
- Stopped stray `next dev` processes to shut down local dev servers as requested.

## Deployment Log (2025-10-17)

- Created dedicated Vercel project `glamora-kz`, linked the repository, and synced env vars so both preview and production use `NEXT_PUBLIC_WHATSAPP_NUMBER=77712248250` and `NEXT_PUBLIC_SITE_URL=https://glamora-kz.vercel.app`.
- Deployed the latest catalog/content updates with `vercel deploy --prod` (commit authored as `koug-y <koug.y@icloud.com>` to satisfy team policy) and pointed the production alias at `https://glamora-kz.vercel.app`.

- Consolidated catalog categories by moving the niacinamide serum product into the general serums collection and removing the redundant dedicated category. Documented slug derivation fallbacks for localized names within the loader.
- Updated the home hero tagline typography to match the CTA button font for consistent branding.

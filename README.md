# glamora_kz storefront

Localized storefront for glamora_kz, a Korean skincare mini-shop in Almaty. The site serves Russian and Kazakh audiences, showcases curated products with rich descriptions, and streamlines WhatsApp-based ordering. Recent updates remove fixed prices in favor of seller-contact prompts and surface populated catalog sections first.

## Prerequisites

- Node.js 18.17+ (or Node 20 LTS)
- npm 9+

## Features

- Locale-aware routing with `/ru` and `/kk` sections for home, catalog, product, and cart flows.
- Centralized product catalog (`data/catalog.ts`) with localized copy, SEO metadata, image fallbacks, and price-hidden messaging.
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

## Project Structure

- `app/` – Next.js App Router pages, layouts, sitemap, and robots metadata.
- `components/` – UI building blocks (navigation, cart, catalog cards, CTA buttons) now reflect locale “contact for price” messaging.
- `data/` – Source of truth for products, categories, and translation dictionaries.
- `lib/` – Utilities for formatting, i18n context, WhatsApp links, safe image handling, and base URL resolution.
- `store/` – Zustand cart store persisted to `localStorage`.
- `public/pictures/` – Product imagery; missing assets fall back to an inline SVG placeholder.

## Key Flows

- **Adding to cart** – `components/ProductPurchasePanel.tsx` manages quantity selection and adds products via the Zustand cart store. After adding an item the primary CTA swaps to a locale-specific success message for ~2.5 seconds, and cart rows always surface product names translated to the active locale.
- **Mini-cart and navigation** – `components/CartBar.tsx` floats above the bottom nav with a brand-tint outline so users always have a path back to the cart. The bottom nav (`components/NavBar.tsx`) mirrors the cart count.
- **Cart management** – `components/CartView.tsx` uses the shared `QtyStepper` for quantity updates, persists changes through the store, and routes customers to WhatsApp with pre-filled order summaries.
- **WhatsApp deep links** – `lib/whatsapp.ts` assembles locale-aware consult and checkout messages using the selected cart items.

## Internationalization

Translations and locale aware slugs live in `data/i18n.ts` and `data/catalog.ts`. The `LocaleSwitcher` component rewrites URLs across locales, translating category and product slugs when possible.

## WhatsApp Ordering

`lib/whatsapp.ts` composes shareable order messages. Button actions throughout the app direct users to WhatsApp with either quick consult text or cart-based summaries, including a form-like prompt for contact details and localized “contact for price” reminder. Totals are intentionally omitted in WhatsApp payloads so the seller can quote prices manually.

## Configuration

- Base URL for sitemap/robots:
  - `NEXT_PUBLIC_SITE_URL` **must** be set (build fails otherwise). Provide the canonical origin, e.g. `https://glamora.kz`.
  - Example `.env.local`:
    
    ```bash
    NEXT_PUBLIC_SITE_URL=https://your-domain.com
    NEXT_PUBLIC_WHATSAPP_NUMBER=77071234567
    ```

- WhatsApp phone number:
  - Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the WhatsApp number the storefront should use (digits only; `+` or spaces are stripped automatically).
  - Builds will fail if the env var is missing or malformed, preventing previews from pinging production numbers.
  - Used by the footer link and all WhatsApp deep links.

- Default locale and document language:
  - The landing redirects to `/ru` in `app/page.tsx`.
  - The `<html lang>` attribute updates on the client after hydration to match the active locale via `components/HtmlLangSetter.tsx`.
  - Note: For SSR, the root `app/layout.tsx` still renders `lang="ru"`; bots and screen readers see the correct lang after hydration. If you need SSR-correct `lang`, consider a middleware-driven approach instead of the client patch.

- Revalidation / ISR:
  - `REVALIDATE` is set to 12 hours in `data/catalog.ts` and exported into each App Router route.
  - Today the catalog is bundled from static data, so revalidate has no effect; the flag stays in place to support future remote data sources.

- Cart persistence:
  - Cart is stored in `localStorage` under key `glamora_cart_v1` (`store/cart.ts`).
  - Bumping the version resets existing client carts.

## Data Model and Content

- Category (`data/catalog.ts`):
  - `id` (enum), `slug` per-locale, `name` per-locale, `blurb` per-locale.
  - Catalog view surfaces categories with products first, then the rest.

- Product (`data/catalog.ts`):
  - `id`, `slug` per-locale, `name` per-locale, `categoryId`, `price`, `currency`, `image`, `short` per-locale, `description` per-locale, `bullets` per-locale.
  - Optional: `ingredients`, `volume`, `seo` per-locale (`title`, `desc`).
  - Locale switcher translates deep product/category slugs when translations exist; otherwise links fall back to `/catalog` in the target locale.

- Assets (`public/pictures`):
  - Put product images here and reference with absolute paths (e.g., `/pictures/sku.png`).
  - Missing assets fall back to an inline SVG placeholder via `lib/safe-image.ts` with a one-time console warning.

## Styling / Branding

- Design tokens live in `app/globals.css` (`--brand`, `--brand-ink`, `--brand-tint`, `--ink`, etc.).
- Inter font is configured in `app/layout.tsx` via `next/font/google`.
- Tailwind customization is in `tailwind.config.ts` (container, colors, radius, shadows, fonts).
- Bottom-fixed nav and cart bars use the `.pb-safe` utility (`padding-bottom: calc(var(--pb-safe-base, 0px) + env(safe-area-inset-bottom))`) so they respect mobile safe areas without drifting higher on iOS.

## Deployment Notes

- `app/sitemap.ts` and `app/robots.ts` respect `NEXT_PUBLIC_SITE_URL` to emit absolute URLs.
- Incremental static regeneration is enabled via `REVALIDATE` (12 hours) for catalog and product pages.

### Vercel

- Add `NEXT_PUBLIC_SITE_URL` in Project → Settings → Environment Variables.
- Deploy; ISR respects the configured revalidation interval.

### Self-hosted Node

- `npm run build` then `npm run start`.
- Ensure `NEXT_PUBLIC_SITE_URL` is present in the runtime environment.

## Troubleshooting

- Placeholder images: If a generic “glamora” placeholder shows, add the missing file under `public/pictures` or fix the `image` path in `data/catalog.ts`.
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

Feel free to adjust catalog data or translations in `data/` and add new product assets under `public/pictures/`.

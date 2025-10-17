"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/clsx";
import { useI18n } from "@/lib/i18n-client";
import {
  composeWhatsAppMessage,
  composeQuickWhatsApp,
  hasOwnerPhone,
  type CartItemPayload,
} from "@/lib/whatsapp";
import { useCatalogClient } from "@/lib/catalog-client-context";
import type { Locale } from "@/lib/locales";
import { useCart } from "@/store/cart";
import { QtyStepper } from "@/components/QtyStepper";
import { PillButton } from "@/components/PillButton";

export function CartView({ locale }: { locale: Locale }) {
  const {
    dict: { cartPage, common },
  } = useI18n();
  const priceLabel = common.priceCheck;
  const items = useCart((state) => state.items);
  const total = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  const ownerPhoneAvailable = hasOwnerPhone();
  const remove = useCart((state) => state.remove);
  const setQty = useCart((state) => state.setQty);
  const { productsById } = useCatalogClient();

  const localizedItems = useMemo(
    () =>
      items.map((item) => {
        const product = productsById.get(item.id);
        const name = product ? product.name[locale] : item.name;
        const translatedSlug = product ? product.slug[locale] : undefined;
        const href =
          product && translatedSlug
            ? `/${locale}/product/${translatedSlug}`
            : `/${locale}/catalog`;

        return {
          ...item,
          displayName: name,
          href,
        };
      }),
    [items, locale, productsById]
  );

  const waLink = useMemo(() => {
    if (!ownerPhoneAvailable) {
      return null;
    }

    if (localizedItems.length === 0) {
      return composeQuickWhatsApp(locale, "order");
    }

    const payload: CartItemPayload[] = localizedItems.map((item) => ({
      id: item.id,
      name: item.displayName,
      qty: item.qty,
    }));

    return composeWhatsAppMessage(locale, payload, total);
  }, [ownerPhoneAvailable, localizedItems, locale, total]);

  if (localizedItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-border bg-surface-alt p-6 text-center text-sm text-mutedInk">
          {cartPage.emptyState}
        </div>
        <PillButton href={`/${locale}/catalog`}>
          {common.backToCatalog}
        </PillButton>
      </div>
    );
  }

  const steps = [
    { label: common.cart, active: true },
    { label: common.contacts, active: false },
    { label: common.confirm, active: false },
  ];

  return (
    <div className="space-y-6">
      <nav className="flex items-center justify-between rounded-full border border-border bg-surface-alt px-4 py-3 text-xs font-medium uppercase tracking-wide text-mutedInk">
        {steps.map((step, index) => (
          <span
            key={step.label}
            className={cn(
              "flex-1 text-center",
              step.active ? "text-brand" : "opacity-70"
            )}
          >
            {index + 1}. {step.label}
          </span>
        ))}
      </nav>

      <ul className="space-y-4">
        {localizedItems.map((item) => {
          return (
            <li
              key={item.id}
              className="flex items-center gap-4 rounded-3xl border border-border bg-surface-alt p-4"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-surface">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.displayName}
                    fill
                    className="object-contain"
                    sizes="80px"
                    unoptimized={item.image.startsWith("data:")}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-mutedInk">
                    {common.brand}
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={item.href}
                    className="text-sm font-semibold leading-snug text-ink hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    {item.displayName}
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={cartPage.remove}
                    className="text-lg font-semibold text-mutedInk hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <QtyStepper
                    value={item.qty}
                    onChange={(value) => setQty(item.id, value)}
                    min={1}
                  />
                  <span className="text-sm font-medium text-mutedInk">
                    {priceLabel}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="space-y-4 rounded-3xl border border-border bg-surface-alt p-4">
        <div className="flex items-center justify-between text-sm text-mutedInk">
          <span>{common.subtotal}</span>
          <span className="text-sm font-medium text-mutedInk">
            {priceLabel}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-mutedInk">
          <span>{common.total}</span>
          <span className="font-medium text-mutedInk">{priceLabel}</span>
        </div>
        <p className="text-xs leading-relaxed text-mutedInk">
          {cartPage.whatsappIntro}
        </p>
        {ownerPhoneAvailable && waLink ? (
          <PillButton
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {common.checkoutWA}
          </PillButton>
        ) : (
          <div className="rounded-2xl border border-border bg-surface p-3 text-center text-sm text-mutedInk">
            {common.whatsappUnavailable}
          </div>
        )}
      </section>
    </div>
  );
}

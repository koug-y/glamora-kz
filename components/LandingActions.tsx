"use client";

import { useMemo } from "react";
import { PillButton } from "@/components/PillButton";
import { useI18n } from "@/lib/i18n-client";
import {
  composeQuickWhatsApp,
  composeWhatsAppMessage,
  hasOwnerPhone,
  type CartItemPayload,
} from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { useCatalogClient } from "@/lib/catalog-client-context";

export function LandingActions({ catalogHref }: { catalogHref: string }) {
  const { locale, dict } = useI18n();
  const items = useCart((state) => state.items);
  const total = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  const ownerPhoneAvailable = hasOwnerPhone();
  const { productsById } = useCatalogClient();

  const payload: CartItemPayload[] = useMemo(
    () =>
      items.map(({ id, name, qty }) => {
        const product = productsById.get(id);
        const localizedName = product ? product.name[locale] : name;
        return {
          id,
          name: localizedName,
          qty,
        };
      }),
    [items, locale, productsById]
  );

  const orderLink = useMemo(() => {
    if (!ownerPhoneAvailable) {
      return null;
    }

    return payload.length > 0
      ? composeWhatsAppMessage(locale, payload, total)
      : composeQuickWhatsApp(locale, "order");
  }, [ownerPhoneAvailable, payload, locale, total]);

  const consultLink = useMemo(() => {
    if (!ownerPhoneAvailable) {
      return null;
    }

    return composeQuickWhatsApp(locale, "consult");
  }, [ownerPhoneAvailable, locale]);

  return (
    <div className="flex flex-col gap-3">
      <PillButton href={catalogHref}>{dict.home.ctaCatalog}</PillButton>
      {ownerPhoneAvailable ? (
        <>
          {orderLink ? (
            <PillButton href={orderLink} target="_blank" rel="noopener noreferrer">
              {dict.common.orderNow}
            </PillButton>
          ) : null}
          {consultLink ? (
            <PillButton
              href={consultLink}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dict.common.freeConsult}
            </PillButton>
          ) : null}
        </>
      ) : (
        <div className="rounded-3xl border border-border bg-surface-alt p-4 text-center text-sm text-mutedInk">
          {dict.common.whatsappUnavailable}
        </div>
      )}
    </div>
  );
}

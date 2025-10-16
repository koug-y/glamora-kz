"use client";

import { useMemo } from "react";
import { PillButton } from "@/components/PillButton";
import { useI18n } from "@/lib/i18n-client";
import {
  composeQuickWhatsApp,
  composeWhatsAppMessage,
  type CartItemPayload,
} from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { getProductById } from "@/data/catalog";

export function LandingActions({ catalogHref }: { catalogHref: string }) {
  const { locale, dict } = useI18n();
  const items = useCart((state) => state.items);
  const total = useCart((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  const payload: CartItemPayload[] = useMemo(
    () =>
      items.map(({ id, name, qty }) => {
        const product = getProductById(id);
        const localizedName = product ? product.name[locale] : name;
        return {
          id,
          name: localizedName,
          qty,
        };
      }),
    [items, locale]
  );

  const orderLink =
    payload.length > 0
      ? composeWhatsAppMessage(locale, payload, total)
      : composeQuickWhatsApp(locale, "order");

  const consultLink = composeQuickWhatsApp(locale, "consult");

  return (
    <div className="flex flex-col gap-3">
      <PillButton href={catalogHref}>{dict.home.ctaCatalog}</PillButton>
      <PillButton href={orderLink} target="_blank" rel="noopener noreferrer">
        {dict.common.orderNow}
      </PillButton>
      <PillButton
        href={consultLink}
        variant="outline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {dict.common.freeConsult}
      </PillButton>
    </div>
  );
}

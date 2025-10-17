"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import { PillButton } from "@/components/PillButton";
import { QtyStepper } from "@/components/QtyStepper";
import { useI18n } from "@/lib/i18n-client";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/store/cart";

type ProductPurchasePanelProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    locale: Locale;
  };
  cartHref: string;
};

export function ProductPurchasePanel({
  product,
  cartHref,
}: ProductPurchasePanelProps) {
  const {
    dict: { common },
  } = useI18n();
  const addToCart = useCart((state) => state.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAdd = () => {
    const payload: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
      image: product.image,
    };
    addToCart(payload);
    setQty(1);
    setAdded(true);
    setLiveMessage(common.addedToCart);
    if (feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
    }
    feedbackTimer.current = setTimeout(() => {
      setAdded(false);
      setLiveMessage("");
      feedbackTimer.current = null;
    }, 2400);
  };

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        clearTimeout(feedbackTimer.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4 rounded-3xl border border-border bg-surface-alt p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-mutedInk">
          {common.price}
        </span>
        <span className="text-sm font-medium text-mutedInk">
          {common.priceCheck}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-mutedInk">
          {common.qty}
        </span>
        <QtyStepper value={qty} onChange={setQty} min={1} />
      </div>
      <div className="flex flex-col gap-2">
        <PillButton type="button" onClick={handleAdd}>
          {added ? common.addedToCart : common.addToCart}
        </PillButton>
        <PillButton href={cartHref} variant="secondary">
          {common.goToCart}
        </PillButton>
      </div>
      <div aria-live="polite" role="status" className="sr-only">
        {liveMessage}
      </div>
    </div>
  );
}

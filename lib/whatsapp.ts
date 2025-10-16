import type { Locale } from "@/data/catalog";

const PHONE_ENV_KEY = "NEXT_PUBLIC_WHATSAPP_NUMBER";
const rawOwnerPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

if (!rawOwnerPhone) {
  throw new Error(
    `[glamora_kz] ${PHONE_ENV_KEY} is not set. Provide a WhatsApp number for contact links.`
  );
}

const normalizedOwnerPhone = rawOwnerPhone.replace(/[^\d]/g, "");

if (!/^[1-9]\d{6,14}$/.test(normalizedOwnerPhone)) {
  throw new Error(
    `[glamora_kz] ${PHONE_ENV_KEY} must be digits only (7-15 digits, leading zero disallowed).`
  );
}

export const OWNER_PHONE = normalizedOwnerPhone;

export type CartItemPayload = {
  id: string;
  name: string;
  qty: number;
};

const HEADERS: Record<Locale, string> = {
  ru: "Здравствуйте! Хочу оформить заказ в glamora_kz (Алматы).",
  kk: "Сәлеметсіз бе! glamora_kz (Алматы) дүкенінен тапсырыс бергім келеді.",
};

const ITEMS_LABEL: Record<Locale, string> = {
  ru: "Товары:",
  kk: "Тауарлар:",
};

const FORM_LABELS: Record<
  Locale,
  { name: string; address: string; comment: string }
> = {
  ru: {
    name: "Имя: ______",
    address: "Адрес/доставка: ______",
    comment: "Комментарий: ______",
  },
  kk: {
    name: "Аты-жөні: ______",
    address: "Мекенжай/жеткізу: ______",
    comment: "Пікір: ______",
  },
};

function buildMessage(locale: Locale, items: CartItemPayload[], _total: number) {
  void _total;
  const lines: string[] = [HEADERS[locale], ITEMS_LABEL[locale]];

  const unit = locale === "ru" ? "шт." : "дана";

  items.forEach((item, index) => {
    lines.push(`${index + 1}) ${item.name} — ${item.qty} ${unit}`);
  });

  const form = FORM_LABELS[locale];
  lines.push(form.name, form.address, form.comment);

  return lines.join("\n");
}

export function composeWhatsAppMessage(
  locale: Locale,
  items: CartItemPayload[],
  total: number
) {
  const message = buildMessage(locale, items, total);
  return `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(message)}`;
}

const QUICK_PREFILLS: Record<
  Locale,
  { order: string; consult: string }
> = {
  ru: {
    order:
      "Здравствуйте! Хочу сделать заказ в glamora_kz. Подскажите, пожалуйста.",
    consult: "Здравствуйте! Нужна консультация по уходу в glamora_kz.",
  },
  kk: {
    order: "Сәлеметсіз бе! glamora_kz дүкенінен тапсырыс бергім келеді.",
    consult: "Сәлеметсіз бе! glamora_kz бойынша кеңес керек еді.",
  },
};

export type QuickIntent = "order" | "consult";

export function composeQuickWhatsApp(locale: Locale, intent: QuickIntent) {
  const text = QUICK_PREFILLS[locale][intent];
  return `https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(text)}`;
}

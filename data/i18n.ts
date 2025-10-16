import type { Locale } from "./catalog";

type BaseDictionary = {
  common: {
    brand: string;
    city: string;
    catalog: string;
    orderNow: string;
    freeConsult: string;
    searchByName: string;
    addToCart: string;
    goToCart: string;
    cart: string;
    confirm: string;
    contacts: string;
    checkoutWA: string;
    total: string;
    qty: string;
    emptyCart: string;
    backToCatalog: string;
    pcs: string;
    home: string;
    price: string;
    priceCheck: string;
    volume: string;
    benefits: string;
    description: string;
    ingredients: string;
    continueShopping: string;
    subtotal: string;
    addedToCart: string;
  };
  home: {
    heroTitle: string;
    heroTaglineLines: string[];
    ctaCatalog: string;
    ctaOrderNowPrefill: string;
    ctaConsultPrefill: string;
    miniCartLabel: string;
    miniCartEmpty: string;
  };
  catalogPage: {
    title: string;
    subtitle: string;
    empty: string;
  };
  categoryPage: {
    searchPlaceholder: string;
    noResults: string;
  };
  productPage: {
    benefits: string;
    description: string;
    ingredients: string;
    ingredientsEmpty: string;
    volume: string;
    goBack: string;
  };
  cartPage: {
    title: string;
    summaryTitle: string;
    emptyState: string;
    whatsappIntro: string;
    remove: string;
  };
  footer: {
    legal: string;
    whatsapp: string;
    toggleRu: string;
    toggleKk: string;
  };
  seo: {
    home: { title: string; description: string };
    catalog: { title: string; description: string };
    cart: { title: string; description: string };
  };
};

const dictionaries: Record<Locale, BaseDictionary> = {
  ru: {
    common: {
      brand: "glamora_kz",
      city: "Алматы",
      catalog: "Каталог товаров",
      orderNow: "Хочу заказать",
      freeConsult: "Бесплатная консультация",
      searchByName: "Поиск по названию",
      addToCart: "В корзину",
      goToCart: "Перейти в корзину",
      cart: "Корзина",
      confirm: "Подтверждение",
      contacts: "Контакты",
      checkoutWA: "Оформить через WhatsApp",
      total: "Итого",
      qty: "Кол-во",
      emptyCart: "Ваша корзина пуста",
      backToCatalog: "Вернуться к каталогу",
      pcs: "шт.",
      home: "Главная",
      price: "Цена",
      priceCheck: "Уточните цену у продавца",
      volume: "Объем",
      benefits: "Преимущества",
      description: "Описание",
      ingredients: "Состав",
      continueShopping: "Продолжить покупки",
      subtotal: "Промежуточный итог",
      addedToCart: "Товар добавлен в корзину",
    },
    home: {
      heroTitle: "Корейская уходовая косметика",
      heroTaglineLines: [
        "УХОДОВАЯ КОСМЕТИКА | АЛМАТЫ — ОРИГИНАЛЬНАЯ КОСМЕТИКА 100%. 💯",
        "Найди свой идеальный уход. 🚛 Бесплатная консультация и доставка.",
        "🎁 Подарки к каждому заказу.",
      ],
      ctaCatalog: "Каталог товаров (г. Алматы)",
      ctaOrderNowPrefill:
        "Здравствуйте! Хочу сделать заказ в glamora_kz. Подскажите, пожалуйста.",
      ctaConsultPrefill:
        "Здравствуйте! Нужна консультация по уходу в glamora_kz.",
      miniCartLabel: "В корзине",
      miniCartEmpty: "Корзина пуста",
    },
    catalogPage: {
      title: "Категории",
      subtitle: "Выберите категорию, чтобы увидеть доступные продукты.",
      empty: "Категория временно пуста — мы пополним позиции совсем скоро.",
    },
    categoryPage: {
      searchPlaceholder: "Поиск по названию",
      noResults: "Нет товаров по вашему запросу. Попробуйте другой фильтр.",
    },
    productPage: {
      benefits: "Преимущества",
      description: "Описание",
      ingredients: "Состав",
      ingredientsEmpty: "Состав уточняется",
      volume: "Объем",
      goBack: "Назад к каталогу",
    },
    cartPage: {
      title: "Корзина",
      summaryTitle: "Подтверждение",
      emptyState: "Ваша корзина пуста — добавьте товары из каталога.",
      whatsappIntro:
        "Проверьте заказ и нажмите кнопку, чтобы отправить заявку в WhatsApp.",
      remove: "Удалить",
    },
    footer: {
      legal: "© glamora_kz. Оригинальная корейская косметика в Алматы.",
      whatsapp: "Написать в WhatsApp",
      toggleRu: "Русский",
      toggleKk: "Қазақша",
    },
    seo: {
      home: {
        title: "Покупайте корейскую уходовую косметику в Алматы | glamora_kz",
        description:
          "glamora_kz — мини-магазин корейской уходовой косметики в Алматы. Бесплатная консультация и доставка.",
      },
      catalog: {
        title: "Каталог уходовой косметики в Алматы | glamora_kz",
        description:
          "Выбирайте уход за кожей: очищение, сыворотки, кремы и другие средства с доставкой по Алматы.",
      },
      cart: {
        title: "Корзина — заказ корейской косметики в Алматы | glamora_kz",
        description:
          "Проверьте выбранные товары и оформите заказ на корейскую уходовую косметику glamora_kz в Алматы через WhatsApp.",
      },
    },
  },
  kk: {
    common: {
      brand: "glamora_kz",
      city: "Алматы",
      catalog: "Тауарлар каталогы",
      orderNow: "Тапсырыс бергім келеді",
      freeConsult: "Тегін консультация",
      searchByName: "Атауы бойынша іздеу",
      addToCart: "Себетке қосу",
      goToCart: "Себетке өту",
      cart: "Себет",
      confirm: "Растау",
      contacts: "Байланыс",
      checkoutWA: "WhatsApp арқылы тапсырыс беру",
      total: "Барлығы",
      qty: "Саны",
      emptyCart: "Себет бос",
      backToCatalog: "Каталогқа оралу",
      pcs: "дана",
      home: "Басты бет",
      price: "Бағасы",
      priceCheck: "Бағаны сатушыдан нақтылаңыз",
      volume: "Көлемі",
      benefits: "Артықшылықтары",
      description: "Сипаттама",
      ingredients: "Құрамы",
      continueShopping: "Сатып алуды жалғастыру",
      subtotal: "Аралық сома",
      addedToCart: "Тауар себетке қосылды",
    },
    home: {
      heroTitle: "Кореяның тері күтім косметикасы",
      heroTaglineLines: [
        "ТЕРІ КҮТІМІ | АЛМАТЫ — 100% ТҮПНҰСҚА КОСМЕТИКА. 💯",
        "Өз күтіміңді тап. 🚛 Тегін консультация және жеткізу.",
        "🎁 Әр тапсырысқа сыйлық.",
      ],
      ctaCatalog: "Тауарлар каталогы (Алматы)",
      ctaOrderNowPrefill:
        "Сәлеметсіз бе! glamora_kz дүкенінен тапсырыс бергім келеді.",
      ctaConsultPrefill:
        "Сәлеметсіз бе! glamora_kz бойынша кеңес керек еді.",
      miniCartLabel: "Себетте",
      miniCartEmpty: "Себет бос",
    },
    catalogPage: {
      title: "Санаттар",
      subtitle: "Қолжетімді өнімдерді көру үшін санатты таңдаңыз.",
      empty: "Санат бос. Жақында жаңа өнімдер қосылады.",
    },
    categoryPage: {
      searchPlaceholder: "Атауы бойынша іздеу",
      noResults: "Сұраныс бойынша тауар табылмады. Басқа сөзді қолданып көріңіз.",
    },
    productPage: {
      benefits: "Артықшылықтары",
      description: "Сипаттама",
      ingredients: "Құрамы",
      ingredientsEmpty: "Құрамы нақтылануда",
      volume: "Көлемі",
      goBack: "Каталогқа оралу",
    },
    cartPage: {
      title: "Себет",
      summaryTitle: "Растау",
      emptyState: "Себет бос — каталогтан тауар қосыңыз.",
      whatsappIntro:
        "Тапсырысты тексеріп, WhatsApp арқылы жіберу үшін түймені басыңыз.",
      remove: "Жою",
    },
    footer: {
      legal: "© glamora_kz. Алматыда түпнұсқа корей косметикасы.",
      whatsapp: "WhatsApp арқылы жазу",
      toggleRu: "Орысша",
      toggleKk: "Қазақша",
    },
    seo: {
      home: {
        title: "Кореяның тері күтімі косметикасы Алматыда | glamora_kz",
        description:
          "glamora_kz — Алматыдағы түпнұсқа корей тері күтімі косметикасы. Тегін консультация және жеткізу.",
      },
      catalog: {
        title: "Тері күтімі косметикасының каталогы Алматыда | glamora_kz",
        description:
          "Күтім құралдары: тазарту, сарысулар, кремдер және тағы басқаларын Алматыдан таңдаңыз.",
      },
      cart: {
        title: "Себет — корей косметикасына тапсырыс Алматыда | glamora_kz",
        description:
          "Таңдалған өнімдерді тексеріп, glamora_kz корей косметикасына тапсырысты WhatsApp арқылы рәсімдеңіз.",
      },
    },
  },
} satisfies Record<Locale, Record<string, unknown>>;

export type Dictionary = BaseDictionary;

export function getDict(locale: Locale) {
  return dictionaries[locale];
}

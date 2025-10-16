export type Locale = "ru" | "kk";

export type Category = {
  id:
    | "cleansing"
    | "washing"
    | "toning"
    | "serums"
    | "face-creams"
    | "eye-cream"
    | "spf"
    | "body-care"
    | "hair-care";
  slug: { ru: string; kk: string };
  name: { ru: string; kk: string };
  blurb: { ru: string; kk: string };
};

export type Product = {
  id: string;
  slug: { ru: string; kk: string };
  name: { ru: string; kk: string };
  categoryId: Category["id"];
  price: number;
  currency: "KZT";
  image: string;
  short: { ru: string; kk: string };
  description: { ru: string; kk: string };
  bullets: { ru: string[]; kk: string[] };
  ingredients?: string;
  volume?: string;
  seo?: {
    ru?: { title?: string; desc?: string };
    kk?: { title?: string; desc?: string };
  };
};

export const LOCALES: Locale[] = ["ru", "kk"];
// Revalidation window kept for future remote catalog data.
// Currently the catalog is bundled, so this flag has no runtime effect.
export const REVALIDATE = 60 * 60 * 12;

export const CATEGORIES: Category[] = [
  {
    id: "cleansing",
    slug: { ru: "ochishchenie", kk: "tazartu" },
    name: { ru: "Очищение", kk: "Тазарту" },
    blurb: {
      ru: "Бальзамы и масла, которые тают макияж и SPF без сухости.",
      kk: "Макияж бен SPF-ті жұмсақ ерітетін бальзамдар мен майлар.",
    },
  },
  {
    id: "washing",
    slug: { ru: "umyvanie", kk: "jyy" },
    name: { ru: "Умывание", kk: "Жуу" },
    blurb: {
      ru: "Гели и пенки для свежести и комфортного умывания утром и вечером.",
      kk: "Таңертең және кешкі күтімге арналған жұмсақ гельдер мен көбіктер.",
    },
  },
  {
    id: "toning",
    slug: { ru: "tonizirovanie", kk: "tonizdeu" },
    name: { ru: "Тонизирование", kk: "Тониздеу" },
    blurb: {
      ru: "Тонеры и пэды, которые выравнивают текстуру и усиливают впитывание.",
      kk: "Текстураны тегістеп, келесі күтімді күшейтетін тонерлер мен падтар.",
    },
  },
  {
    id: "serums",
    slug: { ru: "syvorotki", kk: "sarysular" },
    name: { ru: "Сыворотки", kk: "Сарысулар" },
    blurb: {
      ru: "Активные формулы с ретинолом, витаминами и пептидами.",
      kk: "Ретинол, витаминдер және пептидтері бар белсенді формулалар.",
    },
  },
  {
    id: "face-creams",
    slug: { ru: "kremy-dlya-lica", kk: "bet-kremderi" },
    name: { ru: "Кремы для лица", kk: "Бет кремдері" },
    blurb: {
      ru: "Увлажняющие и выравнивающие кремы на каждый день.",
      kk: "Күнделікті күтімге арналған ылғалдандырғыш және тегістеуші кремдер.",
    },
  },
  {
    id: "eye-cream",
    slug: { ru: "krem-vokrug-glaz", kk: "koz-ainalasy" },
    name: { ru: "Крем вокруг глаз", kk: "Көз айналасына арналған крем" },
    blurb: {
      ru: "Светлые текстуры для деликатной зоны вокруг глаз.",
      kk: "Көз айналасындағы нәзік аймаққа арналған жеңіл текстуралар.",
    },
  },
  {
    id: "spf",
    slug: { ru: "spf-zashchita", kk: "spf-qorganys" },
    name: { ru: "SPF защита", kk: "SPF қорғаныс" },
    blurb: {
      ru: "Солнцезащита на каждый день с комфортными текстурами.",
      kk: "Күнделікті қолдануға ыңғайлы SPF қорғаныштары.",
    },
  },
  {
    id: "body-care",
    slug: { ru: "uhod-za-telom", kk: "dene-kutimi" },
    name: { ru: "Уход за телом", kk: "Дене күтімі" },
    blurb: {
      ru: "Кремы и лосьоны для упругости и увлажнения тела.",
      kk: "Денеге серпімділік пен ылғал беретін кремдер мен лосьондар.",
    },
  },
  {
    id: "hair-care",
    slug: { ru: "uhod-za-volosami", kk: "shash-kutimi" },
    name: { ru: "Уход за волосами", kk: "Шаш күтімі" },
    blurb: {
      ru: "Шампуни и маски для блеска и силы волос.",
      kk: "Шашқа жылтыр мен күш беретін шампуньдар мен маскалар.",
    },
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "dr-althea-balm-50",
    slug: {
      ru: "dr-althea-pure-grinding-cleansing-balm-50ml",
      kk: "dr-althea-pure-grinding-tazartqys-balzam-50ml",
    },
    name: {
      ru: "Dr. Althea Pure Grinding Cleansing Balm 50 мл",
      kk: "Dr. Althea Pure Grinding тазартқыш бальзам 50 мл",
    },
    categoryId: "cleansing",
    price: 8900,
    currency: "KZT",
    image: "/pictures/dr-althea-pure-grinding-cleansing-balm-50ml.png",
    volume: "50 мл",
    short: {
      ru: "Плавящийся бальзам мягко растворяет макияж и SPF, без отдушек, не щиплет глаза.",
      kk: "Еритін бальзам макияж бен SPF-ті жұмсақ ерітеді, иіссіз, көзді ашытпайды.",
    },
    description: {
      ru: "Гидрофильный бальзам на масляной основе быстро снимает стойкий макияж и солнцезащиту, не оставляя пленки. Подходит для чувствительной кожи.",
      kk: "Май негізіндегі гидрофильді бальзам тұрақты макияж бен күн қорғанышын тез кетіреді, қабыршақ қалдырмайды. Сезімтал теріге жарайды.",
    },
    bullets: {
      ru: ["Растворяет водостойкую тушь", "Без отдушек", "Не сушит кожу"],
      kk: ["Су өтпейтін тушьті ерітеді", "Иіссіз", "Теріні құрғатпайды"],
    },
    ingredients: "Масло жожоба, масло подсолнечника, витамин Е",
    seo: {
      ru: {
        title:
          "Dr. Althea Cleansing Balm — бальзам для снятия макияжа в Алматы | glamora_kz",
        desc: "Гидрофильный бальзам Dr. Althea Pure Grinding для бережного очищения и удаления SPF в Алматы.",
      },
      kk: {
        title:
          "Dr. Althea Pure Grinding тазартқыш бальзамы Алматыда | glamora_kz",
        desc: "Сезімтал теріге лайық, SPF пен макияжды ерітетін Dr. Althea Pure Grinding бальзамы.",
      },
    },
  },
  {
    id: "dr-althea-retinol-01",
    slug: {
      ru: "dr-althea-0-1-gentle-retinol-serum-30ml",
      kk: "dr-althea-0-1-nazik-retinol-sarysuy-30ml",
    },
    name: {
      ru: "Dr. Althea 0.1% Gentle Retinol Serum 30 мл",
      kk: "Dr. Althea 0.1% нәзік ретинол сарысуы 30 мл",
    },
    categoryId: "serums",
    price: 13400,
    currency: "KZT",
    image: "/pictures/dr-althea-0-1-gentle-retinol-serum-30ml.png",
    volume: "30 мл",
    short: {
      ru: "Инкапсулированный 0.1% ретинол для постепенного обновления и упругости.",
      kk: "Инкапсуляцияланған 0.1% ретинол – жаңартуға және серпімділікке.",
    },
    description: {
      ru: "Подходит новичкам: мягкое действие ретинола выравнивает рельеф и тон, уменьшает мелкие морщины.",
      kk: "Жаңадан бастайтындарға лайық: ретинолдың жұмсақ әсері бедер мен түсті тегістейді, ұсақ әжімдерді азайтады.",
    },
    bullets: {
      ru: [
        "Для вечернего ухода",
        "Совместим с успокаивающими средствами",
        "Начинайте 2–3 раза в неделю",
      ],
      kk: [
        "Кешкі күтімге",
        "Тыныштандырушы құралдармен үйлеседі",
        "Аптасына 2–3 реттен бастаңыз",
      ],
    },
    seo: {
      ru: {
        title:
          "Dr. Althea Gentle Retinol — сыворотка с ретинолом в Алматы | glamora_kz",
        desc: "Нежная ретиноловая сыворотка Dr. Althea 0.1% для упругости кожи в Алматы.",
      },
      kk: {
        title:
          "Dr. Althea нәзік ретинол сарысуы Алматыда | glamora_kz",
        desc: "0.1% ретинол бастаушыларға лайық, теріні тегістеп, серпімді етеді.",
      },
    },
  },
  {
    id: "celimax-vita-a-30",
    slug: {
      ru: "celimax-the-vita-a-retinol-brightening-serum-30ml",
      kk: "celimax-the-vita-a-retinol-jarayndatyn-sarysuy-30ml",
    },
    name: {
      ru: "celimax The Vita A Retinol Brightening Serum 30 мл",
      kk: "celimax The Vita A жарықтандырушы ретинол сарысуы 30 мл",
    },
    categoryId: "serums",
    price: 14900,
    currency: "KZT",
    image: "/pictures/celimax-the-vita-a-retinol-shot-tightening-serum-30ml.png",
    volume: "30 мл",
    short: {
      ru: "Ретинол + витамины для сияния и тонуса кожи.",
      kk: "Ретинол және витаминдер — жарқырау мен тонус үшін.",
    },
    description: {
      ru: "Комплекс с ретинолом и витаминами поддерживает обновление клеток, выравнивает тон и придает коже здоровое свечение.",
      kk: "Ретинол мен витаминдер кешені жасушалардың жаңаруын қолдайды, түсті тегістейді және теріге сау жылтыр береді.",
    },
    bullets: {
      ru: ["Улучшает тонус", "Сияние кожи", "Легкая текстура"],
      kk: ["Тонусты арттырады", "Жарқырау береді", "Жеңіл текстура"],
    },
  },
  {
    id: "celimax-retinal-shot-15",
    slug: {
      ru: "celimax-retinal-shot-tightening-booster-15ml",
      kk: "celimax-retinal-shot-tygystyratyn-buster-15ml",
    },
    name: {
      ru: "celimax Retinal Shot Tightening Booster 15 мл",
      kk: "celimax Retinal Shot тығыздандырушы бустер 15 мл",
    },
    categoryId: "serums",
    price: 16700,
    currency: "KZT",
    image: "/pictures/celimax-retinal-shot-tightening-booster-15ml.png",
    volume: "15 мл",
    short: {
      ru: "Ретиналь (витамин A) для упругости и текстуры.",
      kk: "Ретиналь (А дәрумені) — серпімділік пен текстура үшін.",
    },
    description: {
      ru: "Сильный актив для вечернего ухода: визуально сокращает поры и делает кожу плотнее.",
      kk: "Кешкі күтімге арналған белсенді: тесіктердің көрінуін азайтады, теріні тығыздайды.",
    },
    bullets: {
      ru: [
        "Ретиналь стабилизированный",
        "Гладкость кожи",
        "Наносить после тонера",
      ],
      kk: [
        "Тұрақтандырылған ретиналь",
        "Тегіс тері",
        "Тонерден кейін жағу",
      ],
    },
  },
  {
    id: "celimax-cream-35",
    slug: {
      ru: "celimax-pore-dark-spot-brightening-cream-35ml",
      kk: "celimax-tere-tesikteri-men-dakhtar-jarayndatyn-krem-35ml",
    },
    name: {
      ru: "celimax Pore & Dark Spot Brightening Cream 35 мл",
      kk: "celimax Терідегі дақтарды жарықтандыратын крем 35 мл",
    },
    categoryId: "face-creams",
    price: 12900,
    currency: "KZT",
    image: "/pictures/celimax-pore-dark-spot-brightening-cream-35ml.png",
    volume: "35 мл",
    short: {
      ru: "Выравнивает тон, делает поры менее заметными.",
      kk: "Терінің түсін тегістейді, тесіктерді көзге түспейтін етеді.",
    },
    description: {
      ru: "Легкий крем с ниацинамидом и экстрактами для равномерного тона и гладкости.",
      kk: "Ниацинамид және экстракттары бар жеңіл крем — біркелкі түс пен тегістік үшін.",
    },
    bullets: {
      ru: ["Ниацинамид", "Увлажнение без липкости", "Под макияж"],
      kk: ["Ниацинамид", "Жабысқақ емес ылғал", "Макияж астына болады"],
    },
  },
  {
    id: "celimax-pads",
    slug: {
      ru: "celimax-pore-dark-spot-brightening-pad",
      kk: "celimax-jarayndatyn-pad",
    },
    name: {
      ru: "celimax Brightening Pad",
      kk: "celimax жарықтандырушы падтар",
    },
    categoryId: "toning",
    price: 9900,
    currency: "KZT",
    image: "/pictures/celimax-pore-dark-spot-brightening-pad.png",
    short: {
      ru: "Деликатное отшелушивание и сияние — быстро и удобно.",
      kk: "Жұмсақ пилинг және жарқырау — тез әрі ыңғайлы.",
    },
    description: {
      ru: "Тонер‑пэды выравнивают текстуру, освежают и улучшают впитывание последующих средств.",
      kk: "Тонер‑падтар текстураны тегістеп, сергітеді және келесі құралдардың сіңуін жақсартады.",
    },
    bullets: {
      ru: ["Мягкое отшелушивание", "Сияние", "После умывания"],
      kk: ["Жұмсақ пилинг", "Жарқырау", "Жуудан кейін"],
    },
  },
  {
    id: "lagom-neck-50",
    slug: {
      ru: "lagom-collagen-anti-wrinkle-neck-cream-50ml",
      kk: "lagom-kollagen-ary-karsy-moyyn-kremi-50ml",
    },
    name: {
      ru: "LAGOM Collagen Anti‑Wrinkle Neck Cream 50 мл",
      kk: "LAGOM Коллагенді әжімге қарсы мойын кремі 50 мл",
    },
    categoryId: "body-care",
    price: 15900,
    currency: "KZT",
    image: "/pictures/lagom-collagen-anti-wrinkle-neck-cream-50ml.png",
    volume: "50 мл",
    short: {
      ru: "Упругая кожа шеи и декольте без липкости.",
      kk: "Мойын мен декольтеге серпімділік, жабысқақтықсыз.",
    },
    description: {
      ru: "Коллагеновый крем питает и визуально подтягивает кожу в зоне шеи.",
      kk: "Коллагенді крем мойын аймағындағы теріні қоректендіріп, тығыздайды.",
    },
    bullets: {
      ru: [
        "Быстро впитывается",
        "Комфортная текстура",
        "Ежедневно утром/вечером",
      ],
      kk: [
        "Жылдам сіңеді",
        "Ыңғайлы текстура",
        "Күн сайын таңертең/кешке",
      ],
    },
  },
  {
    id: "celimax-booster-30",
    slug: {
      ru: "celimax-pore-tightening-booster-30ml",
      kk: "celimax-tere-tesik-busteri-30ml",
    },
    name: {
      ru: "celimax Pore Tightening Booster 30 мл",
      kk: "celimax Тері тесік бәсендеткіш бустер 30 мл",
    },
    categoryId: "serums",
    price: 15200,
    currency: "KZT",
    image: "/pictures/celimax-retinal-shot-tightening-booster-15ml.png",
    volume: "30 мл",
    short: {
      ru: "Бустер с ниацинамидом и пептидами, который визуально сужает поры.",
      kk: "Ниацинамид пен пептидтері бар бустер тесіктерді көзге түспейтін етеді.",
    },
    description: {
      ru: "Легкая формула для дневного ухода: регулирует себум, освежает и оставляет кожу упругой и гладкой.",
      kk: "Күндізгі күтімге лайық жеңіл формула: себумды реттеп, теріні серпімді әрі тегіс етеді.",
    },
    bullets: {
      ru: [
        "Подходит для комбинированной кожи",
        "Можно наносить под крем",
        "Сужает поры визуально",
      ],
      kk: [
        "Аралас теріге лайық",
        "Крем астына жағуға болады",
        "Тесіктерді визуалды азайтады",
      ],
    },
  },
];

export const productsById = new Map(PRODUCTS.map((product) => [product.id, product]));

export function getCategoryBySlug(locale: Locale, slug: string): Category | undefined {
  return CATEGORIES.find((category) => category.slug[locale] === slug);
}

export function getProductBySlug(locale: Locale, slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug[locale] === slug);
}

export function getProductsByCategory(categoryId: Category["id"]): Product[] {
  return PRODUCTS.filter((product) => product.categoryId === categoryId);
}

export function translateCategorySlug(
  slug: string,
  from: Locale,
  to: Locale
): string | undefined {
  const match = CATEGORIES.find((category) => category.slug[from] === slug);
  return match?.slug[to];
}

export function translateProductSlug(
  slug: string,
  from: Locale,
  to: Locale
): string | undefined {
  const match = PRODUCTS.find((product) => product.slug[from] === slug);
  return match?.slug[to];
}

export function getProductById(id: string): Product | undefined {
  return productsById.get(id);
}

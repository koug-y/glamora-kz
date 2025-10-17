import { promises as fs } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import type { Locale } from "@/lib/locales";
import { LOCALES } from "@/lib/locales";

const CATEGORY_PREFIX = "category_";
const PRODUCT_PREFIX = "product_";
const CATEGORY_INFO_FILE = "_category_info.json";
const PRODUCT_INFO_SUFFIX = "_info.json";
const IMAGE_PATTERN = /^product_[a-z0-9-]+_photo(?:[-_\w]*)\.(png|jpg|jpeg|webp|gif)$/i;
const ORDER_KEY = "order";

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

export const DEFAULT_CURRENCY = "KZT";
export const DEFAULT_REVALIDATE_SECONDS = 60;

const LocalizedStringSchema = z.object({
  ru: z.string().min(1).optional(),
  kk: z.string().min(1).optional(),
});

const LocalizedSeoSchema = z.object({
  ru: z
    .object({
      title: z.string().optional(),
      desc: z.string().optional(),
    })
    .optional(),
  kk: z
    .object({
      title: z.string().optional(),
      desc: z.string().optional(),
    })
    .optional(),
});

export const CategorySchema = z
  .object({
    id: z.string().regex(ID_PATTERN, {
      message: "Category id must be lowercase, ASCII, dashed",
    }),
    slug: LocalizedStringSchema.optional(),
    name: LocalizedStringSchema.optional(),
    blurb: LocalizedStringSchema.optional(),
    [ORDER_KEY]: z.number().optional(),
  })
  .strict();

export const ProductSchema = z
  .object({
    id: z.string().regex(ID_PATTERN, {
      message: "Product id must be lowercase, ASCII, dashed",
    }),
    categoryId: z.string().regex(ID_PATTERN, {
      message: "categoryId must be lowercase, ASCII, dashed",
    }),
    slug: LocalizedStringSchema,
    name: LocalizedStringSchema,
    short: LocalizedStringSchema.optional(),
    description: LocalizedStringSchema.optional(),
    price: z.number().nonnegative(),
    currency: z.string().default(DEFAULT_CURRENCY),
    volume: z.string().optional(),
    seo: LocalizedSeoSchema.optional(),
    images: z.array(z.string()).optional(),
    [ORDER_KEY]: z.number().optional(),
  })
  .strict();

export type Category = {
  id: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  blurb: Record<Locale, string>;
  order?: number;
};

export type Product = {
  id: string;
  categoryId: string;
  slug: Record<Locale, string>;
  name: Record<Locale, string>;
  short: Record<Locale, string>;
  description: Record<Locale, string>;
  price: number;
  currency: string;
  volume?: string;
  seo?: {
    ru?: { title?: string; desc?: string };
    kk?: { title?: string; desc?: string };
  };
  images: string[];
  image: string | null;
  order?: number;
};

type CatalogData = {
  categories: Category[];
  products: Product[];
};

const catalogDir = resolveCatalogDir();

function resolveCatalogDir(): string {
  const configured = process.env.CATALOG_DIR;
  if (configured && configured.trim().length > 0) {
    return resolve(process.cwd(), configured);
  }
  return resolve(process.cwd(), "catalog");
}

function ensureLocaleRecord<T>(
  record: Partial<Record<Locale, T>> | undefined,
  fallback: (locale: Locale) => T
): Record<Locale, T> {
  const result: Record<Locale, T> = {} as Record<Locale, T>;
  for (const locale of LOCALES) {
    const value = record?.[locale];
    result[locale] = value !== undefined && value !== null ? value : fallback(locale);
  }
  return result;
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a",
  ә: "a",
  б: "b",
  в: "v",
  г: "g",
  ғ: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  қ: "k",
  л: "l",
  м: "m",
  н: "n",
  ң: "ng",
  о: "o",
  ө: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ұ: "u",
  ү: "u",
  ф: "f",
  х: "kh",
  һ: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ъ: "",
  ы: "y",
  і: "i",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

function transliterateToAscii(source: string): string {
  let result = "";
  for (const char of source) {
    const lower = char.toLowerCase();
    const mapped = CYRILLIC_TO_LATIN[lower];
    if (mapped !== undefined) {
      result += mapped;
    } else {
      result += lower !== char ? char : lower;
    }
  }
  return result;
}

function slugifyLocaleText(value: string): string {
  const transliterated = transliterateToAscii(value);
  const normalized = transliterated
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return slug;
}

function toWebPath(filePath: string): string {
  const rel = relative(catalogDir, filePath).split(sep).join("/");
  return `/assets/${rel}`;
}

function buildCategory(input: z.infer<typeof CategorySchema>): Category {
  const id = input.id;
  const slug = ensureLocaleRecord(input.slug, (locale) => {
    const localizedName = input.name?.[locale];
    if (localizedName) {
      const derived = slugifyLocaleText(localizedName);
      if (derived.length > 0) {
        return derived;
      }
    }
    return id;
  });
  const name = ensureLocaleRecord(input.name, () => id);
  const blurb = ensureLocaleRecord(input.blurb, () => "");
  const order = input[ORDER_KEY];

  return {
    id,
    slug,
    name,
    blurb,
    order,
  };
}

function buildProduct(
  input: z.infer<typeof ProductSchema>,
  assets: string[]
): Product {
  const name = ensureLocaleRecord(input.name, () => input.id);
  const slug = ensureLocaleRecord(input.slug, (locale) => {
    const localizedName = input.name?.[locale];
    if (localizedName) {
      const derived = slugifyLocaleText(localizedName);
      if (derived.length > 0) {
        return derived;
      }
    }
    return input.id;
  });
  const short = ensureLocaleRecord(input.short, () => "");
  const description = ensureLocaleRecord(input.description, () => "");
  const seo = input.seo
    ? {
        ru: input.seo.ru ?? undefined,
        kk: input.seo.kk ?? undefined,
      }
    : undefined;

  const images = assets;
  const image = images[0] ?? null;

  return {
    id: input.id,
    categoryId: input.categoryId,
    slug,
    name,
    short,
    description,
    price: input.price,
    currency: input.currency ?? DEFAULT_CURRENCY,
    volume: input.volume,
    seo,
    images,
    image,
    order: input[ORDER_KEY],
  };
}

async function readJsonFile<T>(
  filePath: string,
  schema: z.ZodSchema<T>
): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(raw);
    return schema.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Missing required file: ${filePath}`);
    }
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
        .join("; ");
      throw new Error(`Invalid JSON schema at ${filePath}: ${issues}`);
    }
    throw new Error(`Failed to parse JSON at ${filePath}: ${(error as Error).message}`);
  }
}

async function collectProductImages(
  productDir: string,
  productId: string,
  declared?: string[]
): Promise<string[]> {
  if (declared && declared.length > 0) {
    return await Promise.all(
      declared.map(async (relativePath) => {
        const absolute = resolve(productDir, relativePath);
        const within = relative(productDir, absolute);
        if (within.startsWith("..")) {
          throw new Error(
            `Image path "${relativePath}" for product "${productId}" resolves outside of its directory.`
          );
        }
        try {
          await fs.access(absolute);
        } catch {
          throw new Error(
            `Image "${relativePath}" declared for product "${productId}" not found in ${productDir}`
          );
        }
        return toWebPath(absolute);
      })
    );
  }

  const entries = await fs.readdir(productDir, { withFileTypes: true });
  const candidates = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_PATTERN.test(name));

  const resolved = candidates.length > 0 ? candidates : entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => {
      const lower = name.toLowerCase();
      return Array.from(IMAGE_EXTENSIONS).some((ext) => lower.endsWith(ext));
    });

  resolved.sort((a, b) => a.localeCompare(b));

  return resolved.map((file) => toWebPath(join(productDir, file)));
}

async function loadCatalogRaw(): Promise<CatalogData> {
  const catalogStats = await fs.stat(catalogDir).catch(() => {
    throw new Error(
      `Catalog directory "${catalogDir}" not found. Create it or set CATALOG_DIR.`
    );
  });

  if (!catalogStats.isDirectory()) {
    throw new Error(`Catalog directory "${catalogDir}" is not a directory.`);
  }

  const categoryEntries = await fs.readdir(catalogDir, { withFileTypes: true });
  const categories: Category[] = [];
  const products: Product[] = [];

  const productIdSet = new Set<string>();
  const productSlugSet: Record<Locale, Map<string, string>> = {
    ru: new Map(),
    kk: new Map(),
  };

  const categoryIdSet = new Set<string>();
  const categorySlugSet: Record<Locale, Map<string, string>> = {
    ru: new Map(),
    kk: new Map(),
  };

  for (const entry of categoryEntries) {
    if (!entry.isDirectory() || !entry.name.startsWith(CATEGORY_PREFIX)) {
      continue;
    }

    const categoryId = entry.name.slice(CATEGORY_PREFIX.length);
    if (!ID_PATTERN.test(categoryId)) {
      throw new Error(
        `Invalid category folder name "${entry.name}". Expected "category_<id>" with lowercase dashed id.`
      );
    }

    const categoryPath = join(catalogDir, entry.name);
    const infoPath = join(categoryPath, CATEGORY_INFO_FILE);
    let categoryData: z.infer<typeof CategorySchema>;

    try {
      await fs.access(infoPath);
      categoryData = await readJsonFile(infoPath, CategorySchema);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        categoryData = {
          id: categoryId,
          slug: undefined,
          name: undefined,
          blurb: undefined,
        };
      } else {
        throw error;
      }
    }

    if (categoryData.id !== categoryId) {
      throw new Error(
        `Category info id "${categoryData.id}" mismatch with folder "${entry.name}".`
      );
    }

    const category = buildCategory(categoryData);

    if (categoryIdSet.has(category.id)) {
      throw new Error(`Duplicate category id "${category.id}".`);
    }
    categoryIdSet.add(category.id);

    for (const locale of LOCALES) {
      const slug = category.slug[locale];
      const existing = categorySlugSet[locale].get(slug);
      if (existing) {
        throw new Error(
          `Duplicate category slug "${slug}" for locale "${locale}". Appears in "${existing}" and "${category.id}".`
        );
      }
      categorySlugSet[locale].set(slug, category.id);
    }

    categories.push(category);

    const productEntries = await fs.readdir(categoryPath, {
      withFileTypes: true,
    });

    for (const productEntry of productEntries) {
      if (!productEntry.isDirectory() || !productEntry.name.startsWith(PRODUCT_PREFIX)) {
        continue;
      }

      const productId = productEntry.name.slice(PRODUCT_PREFIX.length);
      if (!ID_PATTERN.test(productId)) {
        throw new Error(
          `Invalid product folder name "${productEntry.name}" in category "${category.id}".`
        );
      }

      const productDir = join(categoryPath, productEntry.name);
      const infoFilename = `product_${productId}${PRODUCT_INFO_SUFFIX}`;
      const infoPath = join(productDir, infoFilename);

      const productData = await readJsonFile(infoPath, ProductSchema);

      if (productData.id !== productId) {
        throw new Error(
          `Product info id "${productData.id}" mismatch with folder "${productEntry.name}".`
        );
      }

      if (productData.categoryId !== category.id) {
        throw new Error(
          `Product "${productData.id}" categoryId "${productData.categoryId}" does not match parent category "${category.id}".`
        );
      }

      if (productIdSet.has(productData.id)) {
        throw new Error(`Duplicate product id "${productData.id}".`);
      }
      productIdSet.add(productData.id);

      const imageAssets = await collectProductImages(
        productDir,
        productData.id,
        productData.images
      );

      const normalizedProductData: z.infer<typeof ProductSchema> = {
        ...productData,
        currency: productData.currency ?? DEFAULT_CURRENCY,
      };

      const product = buildProduct(normalizedProductData, imageAssets);

      for (const locale of LOCALES) {
        const slug = product.slug[locale];
        const existing = productSlugSet[locale].get(slug);
        if (existing) {
          throw new Error(
            `Duplicate product slug "${slug}" for locale "${locale}". Appears in "${existing}" and "${product.id}".`
          );
        }
        productSlugSet[locale].set(slug, product.id);
      }

      products.push(product);
    }
  }

  return { categories, products };
}

const loadCatalogCached = unstable_cache(
  loadCatalogRaw,
  ["catalog-data"],
  { revalidate: DEFAULT_REVALIDATE_SECONDS }
);

async function getCatalogData(options?: { fresh?: boolean }): Promise<CatalogData> {
  if (options?.fresh) {
    return loadCatalogRaw();
  }
  try {
    return await loadCatalogCached();
  } catch (error) {
    if (error instanceof Error && /incrementalCache/i.test(error.message)) {
      return loadCatalogRaw();
    }
    throw error;
  }
}

export async function getCategories(options?: {
  fresh?: boolean;
}): Promise<Category[]> {
  const { categories } = await getCatalogData(options);
  return categories.slice();
}

export async function getProducts(options?: {
  fresh?: boolean;
}): Promise<Product[]> {
  const { products } = await getCatalogData(options);
  return products.slice();
}

export async function getProductsByCategory(
  categoryId: string,
  options?: { fresh?: boolean }
): Promise<Product[]> {
  const products = await getProducts(options);
  return products.filter((product) => product.categoryId === categoryId);
}

export async function getProductBySlug(
  locale: Locale,
  slug: string,
  options?: { fresh?: boolean }
): Promise<Product | undefined> {
  const products = await getProducts(options);
  return products.find((product) => product.slug[locale] === slug);
}

export async function getCategoryBySlug(
  locale: Locale,
  slug: string,
  options?: { fresh?: boolean }
): Promise<Category | undefined> {
  const categories = await getCategories(options);
  return categories.find((category) => category.slug[locale] === slug);
}

export async function getProductById(
  id: string,
  options?: { fresh?: boolean }
): Promise<Product | undefined> {
  const products = await getProducts(options);
  return products.find((product) => product.id === id);
}

export async function translateCategorySlug(
  slug: string,
  from: Locale,
  to: Locale,
  options?: { fresh?: boolean }
): Promise<string | undefined> {
  const categories = await getCategories(options);
  const match = categories.find((category) => category.slug[from] === slug);
  return match?.slug[to];
}

export async function translateProductSlug(
  slug: string,
  from: Locale,
  to: Locale,
  options?: { fresh?: boolean }
): Promise<string | undefined> {
  const products = await getProducts(options);
  const match = products.find((product) => product.slug[from] === slug);
  return match?.slug[to];
}

export function getCatalogDir(): string {
  return catalogDir;
}

export function sortCategoriesByLocale(
  categories: Category[],
  locale: Locale
): Category[] {
  return categories
    .slice()
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name[locale].localeCompare(b.name[locale], locale);
    });
}

export function sortProductsByLocale(
  products: Product[],
  locale: Locale
): Product[] {
  return products
    .slice()
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name[locale].localeCompare(b.name[locale], locale);
    });
}

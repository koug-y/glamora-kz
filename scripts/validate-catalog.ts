import process from "node:process";
import {
  getCategories,
  getProducts,
  sortCategoriesByLocale,
  sortProductsByLocale,
} from "@/lib/catalog-fs";
import { LOCALES } from "@/lib/locales";

async function main() {
  try {
    const categories = await getCategories({ fresh: true });
    const products = await getProducts({ fresh: true });

    for (const locale of LOCALES) {
      sortCategoriesByLocale(categories, locale);
      sortProductsByLocale(products, locale);
    }

    const productLessCategories = categories.filter(
      (category) => !products.some((product) => product.categoryId === category.id)
    );

    console.log(
      `[catalog] Loaded ${categories.length} categories, ${products.length} products.`
    );

    if (productLessCategories.length > 0) {
      console.warn(
        `[catalog] Warning: ${productLessCategories.length} categories currently have no products.`
      );
    }
  } catch (error) {
    console.error("[catalog] Validation failed:");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

void main();

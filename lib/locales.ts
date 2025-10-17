export const LOCALES = ["ru", "kk"] as const;

export type Locale = (typeof LOCALES)[number];

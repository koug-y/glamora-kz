const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return currencyFormatter
    .format(amount)
    .replace(/\u00a0/g, "\u202f")
    .replace(" KZT", " ₸");
}


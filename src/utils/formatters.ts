import { getCurrency, getLocale } from "./i18nFormat";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency: getCurrency(),
  }).format(value);
}

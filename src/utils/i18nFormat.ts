import i18n from "../i18n";

const LOCALE_BY_LANG: Record<string, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
  he: "he-IL",
};

const CURRENCY_BY_LANG: Record<string, string> = {
  pt: "BRL",
  en: "USD",
  es: "EUR",
  he: "ILS",
};

export function getLocale(): string {
  const lang = i18n.resolvedLanguage || i18n.language || "pt";
  return LOCALE_BY_LANG[lang] ?? "pt-BR";
}

export function getCurrency(): string {
  const lang = i18n.resolvedLanguage || i18n.language || "pt";
  return CURRENCY_BY_LANG[lang] ?? "BRL";
}

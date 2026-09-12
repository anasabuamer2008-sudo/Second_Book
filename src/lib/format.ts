import { CURRENCY, PRICE_LOCALES } from "./config";

const priceFormatters = new Map<string, Intl.NumberFormat>();

function getPriceFormatter(locale: string): Intl.NumberFormat {
  let fmt = priceFormatters.get(locale);
  if (!fmt) {
    fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
    priceFormatters.set(locale, fmt);
  }
  return fmt;
}

export function formatPrice(amount: number, lang: "ar" | "he"): string {
  const locale = PRICE_LOCALES[lang];
  return `${getPriceFormatter(locale).format(amount)} ${CURRENCY}`;
}

export function formatNumber(amount: number, lang: "ar" | "he"): string {
  return getPriceFormatter(PRICE_LOCALES[lang]).format(amount);
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(locale: string): Intl.DateTimeFormat {
  let fmt = dateFormatters.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
    dateFormatters.set(locale, fmt);
  }
  return fmt;
}

export function formatDate(iso: string, lang: "ar" | "he"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return getDateFormatter(PRICE_LOCALES[lang]).format(date);
}
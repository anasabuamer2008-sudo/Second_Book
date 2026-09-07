export type Lang = "ar" | "he";

export function getDirection(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" || lang === "he" ? "rtl" : "ltr";
}
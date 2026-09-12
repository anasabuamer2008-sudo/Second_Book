export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://second-book.com";

export const SITE_NAME = "Second Book";

export const BRAND_NAME: Record<"ar" | "he", string> = {
  ar: "الكتاب الثاني",
  he: "הספר השני",
};

export const CURRENCY = "₪";

export const DELIVERY_FEE = 25;

export const FREE_DELIVERY_THRESHOLD = 200;

export const PICKUP_LOCATION: Record<"ar" | "he", string> = {
  ar: "استلام من عارة",
  he: "איסוף מעארה",
};

export const OWNER_NAME = "أنس أبو عامر | אנס אבו עאמר";

export const OWNER_EMAIL = "abdallazeed3@gmail.com";

export const CONTACT: Record<"ar" | "he", { email: string; instagram?: string }> = {
  ar: { email: OWNER_EMAIL, instagram: "" },
  he: { email: OWNER_EMAIL, instagram: "" },
};

export const STORAGE_KEYS = {
  theme: "secondbook-theme",
  cart: "secondbook-storage",
  privacy: "secondbook-privacy-accepted",
};

export const PRICE_LOCALES: Record<"ar" | "he", string> = {
  he: "he-IL",
  ar: "ar",
};

export function getDeliveryFee(method: "delivery" | "pickup" | undefined, subtotal: number): number {
  if (method !== "delivery") return 0;
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
}
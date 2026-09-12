import { getDictionary } from "@/dictionaries";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  return {
    title: dict.meta.checkout.title,
    description: dict.meta.checkout.description,
    alternates: { canonical: `${SITE_URL}/${typedLang}/checkout` },
  };
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
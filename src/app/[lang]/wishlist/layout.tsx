import { getDictionary } from "@/dictionaries";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  return {
    title: dict.meta.wishlist.title,
    description: dict.meta.wishlist.description,
    alternates: { canonical: `${SITE_URL}/${typedLang}/wishlist` },
  };
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
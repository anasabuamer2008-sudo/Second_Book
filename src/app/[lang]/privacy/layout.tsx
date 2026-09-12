import { getDictionary } from "@/dictionaries";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  return {
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
    alternates: { canonical: `${SITE_URL}/${typedLang}/privacy` },
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
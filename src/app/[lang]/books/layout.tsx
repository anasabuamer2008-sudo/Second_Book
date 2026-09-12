import { getDictionary } from "@/dictionaries";
import { SITE_URL } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  return {
    title: dict.meta.books.title,
    description: dict.meta.books.description,
    alternates: { canonical: `${SITE_URL}/${typedLang}/books` },
  };
}

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
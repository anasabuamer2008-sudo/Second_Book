"use client";
import { useParams } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import Link from "next/link";

export default function NotFoundClient() {
  const { lang } = useParams<{ lang?: string }>();
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);

  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-8xl font-extrabold text-primary mb-6" style={{ fontFamily: "var(--font-display-ar), var(--font-display-he), serif" }}>
        404
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-3">
        {typedLang === "ar" ? "الصفحة غير موجودة" : "העמוד לא נמצא"}
      </h1>
      <p className="text-text-secondary mb-8">
        {typedLang === "ar"
          ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
          : "מצטערים, העמוד שחיפשתם לא קיים או הועבר."}
      </p>
      <Link
        href={`/${typedLang}`}
        className="inline-block px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-95"
      >
        {dict.hero.cta}
      </Link>
    </div>
  );
}
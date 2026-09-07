"use client";
import { usePathname, useRouter } from "next/navigation";

const LANGS = [
  { code: "ar", label: "العربية" },
  { code: "he", label: "עברית" },
] as const;

export default function LanguageSwitcher({ currentLang }: { currentLang: "ar" | "he" }) {
  const pathname = usePathname();
  const router = useRouter();

  const go = (code: "ar" | "he") => {
    if (code === currentLang) return;
    router.push(pathname.replace(`/${currentLang}`, `/${code}`));
  };

  const prefetch = (code: string) =>
    router.prefetch(pathname.replace(`/${currentLang}`, `/${code}`));

  return (
    <div className="flex items-center bg-surface-alt rounded-xl p-1 border border-border" role="group" aria-label="Language">
      {LANGS.map((l) => {
        const active = l.code === currentLang;
        return (
          <button
            key={l.code}
            onClick={() => go(l.code)}
            onMouseEnter={() => prefetch(l.code)}
            onFocus={() => prefetch(l.code)}
            onTouchStart={() => prefetch(l.code)}
            aria-pressed={active}
            className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              active
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-foreground hover:bg-border/50"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
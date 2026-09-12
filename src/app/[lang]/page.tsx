"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import Toast from "@/components/ui/Toast";
import BuyGuide from "@/components/ui/BuyGuide";
import Link from "next/link";

const SEARCH_ICONS = [
  { name: "review", d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { name: "single", d: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
  { name: "fair", d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function HomePage() {
  const { lang } = useParams<{ lang: string }>();
  const dict = getDictionary(lang as "ar" | "he");
  const typedLang = lang === "he" ? "he" : "ar";
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 leading-tight fade-up">
              {dict.nav.brand}
            </h1>
            <p className="text-lg md:text-2xl text-white/90 mb-5 font-medium tracking-wide">
              {dict.hero.title} <span className="mx-3 text-white/40">|</span>{" "}
              {typedLang === "he" ? "الكتاب الثاني" : "הספר השני"}
            </p>
            <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
              {dict.hero.subtitle}
            </p>
            <p className="text-white/70 text-base mb-8 leading-relaxed max-w-xl">
              {dict.hero.description}
            </p>
            <Link
              href={`/${typedLang}/books`}
              className="inline-block px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-all duration-200 active:scale-95"
            >
              {dict.hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: dict.trust["1t"], desc: dict.trust["1d"], icon: SEARCH_ICONS[0].d },
            { title: dict.trust["2t"], desc: dict.trust["2d"], icon: SEARCH_ICONS[1].d },
            { title: dict.trust["3t"], desc: dict.trust["3d"], icon: SEARCH_ICONS[2].d },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-11 h-11 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-foreground leading-snug">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Note */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 md:p-8 flex items-start gap-4">
          <div className="w-11 h-11 shrink-0 bg-accent text-white rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-foreground text-lg">{dict.orderNote.title}</h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">
              {dict.orderNote.text}{" "}
              <a
                href={`mailto:${dict.orderNote.email}`}
                className="text-primary font-semibold hover:underline"
              >
                {dict.orderNote.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Buying Guide */}
      <BuyGuide lang={typedLang} />
    </>
  );
}
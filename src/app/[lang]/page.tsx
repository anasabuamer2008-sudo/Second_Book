"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { sampleBooks } from "@/lib/books";
import { Book } from "@/store/useCartStore";
import Toast from "@/components/ui/Toast";
import BuyGuide from "@/components/ui/BuyGuide";
import BookCard from "@/components/ui/BookCard";
import { useInView } from "@/hooks/useInView";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const BookModal = dynamic(() => import("@/components/ui/BookModal"), { ssr: false });

const FEATURED_IDS = ["1", "25", "27", "28"];

export default function HomePage() {
  const { lang } = useParams<{ lang: string }>();
  const dict = getDictionary(lang as "ar" | "he");
  const typedLang = lang === "he" ? "he" : "ar";
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { ref: guideRef, inView } = useInView<HTMLDivElement>(0.04);

  const featured = FEATURED_IDS.map((id) => sampleBooks.find((b) => b.id === id)).filter(
    (b): b is Book => Boolean(b)
  );

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        lang={typedLang}
        dict={dict}
        onToast={setToastMsg}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${lang === "he" ? "/he" : "/ar"}#organization`,
            name: "Second Book",
            alternateName: dict.hero.title,
            description: dict.meta.description,
            availableLanguage: ["ar", "he"],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: dict.meta.title,
            alternateName: dict.hero.subtitle,
            url: `/${typedLang}`,
            inLanguage: typedLang,
          }),
        }}
      />

      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary border-b border-primary-dark/40">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-primary-light/30 blur-3xl" />
          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {dict.hero.subtitle}
              </span>
              <h1 className="text-white mb-4">
                {dict.hero.title}
                <span className="block text-2xl md:text-3xl font-display font-bold text-white/90 mt-2">
                  {typedLang === "he" ? "الكتاب الثاني" : "הספר השני"}
                </span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-xl mb-8">
                {dict.hero.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${typedLang}/books`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20"
                >
                  {dict.hero.cta}
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href={`/${typedLang}/about`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 active:scale-95 transition-all duration-200"
                >
                  {dict.nav.about}
                </Link>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-10 text-white">
                <div>
                  <div className="text-2xl font-extrabold">{sampleBooks.length}</div>
                  <div className="text-xs text-white/70">{dict.books.title}</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">₪25</div>
                  <div className="text-xs text-white/70">
                    {typedLang === "ar" ? "توصيل لكل المناطق" : "משלוח לכל האזורים"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">
                    {typedLang === "ar" ? "مجاناً" : "חינם"}
                  </div>
                  <div className="text-xs text-white/70">
                    {typedLang === "ar" ? "استلام من عارة" : "איסוף מעארה"}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating book stack */}
            <div className="relative hidden lg:flex items-center justify-center h-[420px]" aria-hidden>
              <div className="relative w-[260px] h-[360px]">
                {/* behind */}
                <div className="hero-book hero-float-3 absolute inset-x-6 top-2 h-[300px] rotate-6 opacity-80 z-0">
                  <Image
                    src="/books/book18.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 200px, 0px"
                    className="object-cover"
                  />
                </div>
                {/* middle (LCP image) */}
                <div className="hero-book hero-spin-slow absolute inset-0 z-10 shadow-2xl">
                  <Image
                    src="/books/book1.png"
                    alt=""
                    fill
                    priority
                    fetchPriority="high"
                    sizes="260px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 rounded-[6px_14px_14px_6px] ring-1 ring-inset ring-white/15" />
                </div>
                {/* front */}
                <div className="hero-book hero-float-2 absolute -inset-x-4 bottom-0 h-[330px] -rotate-12 z-20 shadow-2xl">
                  <Image
                    src="/books/book28.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 240px, 0px"
                    className="object-cover"
                  />
                </div>
                {/* floating chip */}
                <div className="hero-float-3 absolute -left-10 top-1/4 z-30 px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur shadow-xl border border-white/40">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <span className="text-accent">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </span>
                    <span dir="ltr">4.8 · Second Book</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Featured books ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {typedLang === "ar" ? "اختيارات مختارة" : "בחירות נבחרות"}
            </span>
            <h2 className="text-foreground">{dict.books.title}</h2>
            <p className="text-text-secondary mt-2 max-w-lg">{dict.books.subtitle}</p>
          </div>
          <Link
            href={`/${typedLang}/books`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-light transition-colors"
          >
            {typedLang === "ar" ? "عرض كل الكتب" : "הצגת כל הספרים"}
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((book, i) => (
            <div key={book.id} className="reveal in-view" style={{ animationDelay: `${i * 80}ms` }}>
              <BookCard book={book} dict={dict.books} onOpen={setSelectedBook} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* ================= Trust features ================= */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: dict.trust["1t"], desc: dict.trust["1d"], icon: "M12 18.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 3v3m0 12v3m9-9h-3M6 12H3" },
              { title: dict.trust["2t"], desc: dict.trust["2d"], icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
              { title: dict.trust["3t"], desc: dict.trust["3d"], icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= Order note ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-primary-light px-6 md:px-10 py-8 text-white">
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{dict.orderNote.title}</h3>
              <p className="text-white/80 text-sm mt-1 leading-relaxed">
                {dict.orderNote.text}{" "}
                <a
                  href={`mailto:${dict.orderNote.email}`}
                  className="text-white font-bold underline underline-offset-4 hover:text-white/75"
                  dir="ltr"
                >
                  {dict.orderNote.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Buying guide ================= */}
      <div ref={guideRef} className={`reveal ${inView ? "in-view" : ""}`}>
        <BuyGuide lang={typedLang} />
      </div>
    </>
  );
}
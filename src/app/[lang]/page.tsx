import type { Book } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/dictionaries";
import { sampleBooks, bookSeries } from "@/lib/books";
import BuyGuide from "@/components/ui/BuyGuide";
import FeaturedBooks from "@/components/home/FeaturedBooks";
import Marquee from "@/components/home/Marquee";
import BookCover from "@/components/ui/BookCover";

const FEATURED_IDS = ["1", "25", "27", "28"];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const isAr = typedLang === "ar";

  const featured = FEATURED_IDS.map((id) => sampleBooks.find((b) => b.id === id)).filter(
    (b): b is Book => Boolean(b)
  );

  const marqueeItems = [
    ...featured.map((b) => b.title),
    ...bookSeries.map((s) => (isAr ? s.labelAr : s.labelHe)),
    dict.books.title,
    isAr ? "توصيل لكل المناطق ₪25" : "משלוח לכל האזורים ₪25",
  ];

  const seriesCards = bookSeries
    .map((s) => {
      const books = s.bookIds
        .map((id) => sampleBooks.find((b) => b.id === id))
        .filter((b): b is Book => Boolean(b));
      return {
        id: s.id,
        label: isAr ? s.labelAr : s.labelHe,
        books,
        cover: books[0]?.coverImage,
      };
    })
    .filter((s) => s.books.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `/${typedLang}#organization`,
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
        {/* Ambient glows + mesh */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-primary-light/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />
          <span
            className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 text-[9rem] md:text-[16rem] leading-none font-display text-white/[0.05] select-none"
            dir="rtl"
          >
            {isAr ? "كتاب" : "ספר"}
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Copy */}
            <div className="fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm mb-6">
                <svg className="w-4 h-4 animate-sparkle" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {dict.hero.subtitle}
              </span>
              <h1 className="text-white mb-4">
                {isAr ? "الكتاب" : "הספר"}
                <span className="block text-2xl md:text-3xl font-display font-bold mt-2">
                  {isAr ? (
                    <>
                      <span className="text-gradient-gold">الثاني</span>{" "}
                      <span className="text-white/90">— مكتبة كتب وسطّت لك</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gradient-gold">השני</span>{" "}
                      <span className="text-white/90">— חנות ספרים שנבחרה בשבילך</span>
                    </>
                  )}
                </span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-xl mb-8">
                {dict.hero.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/${typedLang}/books`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-lg shadow-black/20 group"
                >
                  {dict.hero.cta}
                  <svg
                    className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                    {isAr ? "توصيل لكل المناطق" : "משלוח לכל האזורים"}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">
                    {isAr ? "مجاناً" : "חינם"}
                  </div>
                  <div className="text-xs text-white/70">
                    {isAr ? "استلام من عارة" : "איסוף מעארה"}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating book stack */}
            <div className="relative hidden lg:flex items-center justify-center h-[420px]" aria-hidden>
              {/* Glow ring */}
              <div className="hero-glow-ring absolute w-80 h-80 rounded-full bg-gradient-to-br from-accent/40 to-primary-light/20 blur-2xl" />

              <div className="relative w-[260px] h-[360px]">
                {/* behind */}
                <div className="hero-book hero-float-3 absolute inset-x-6 top-2 h-[300px] rotate-6 opacity-80 z-0">
                  <Image
                    src="/books/salahDin.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 200px, 0px"
                    className="object-cover"
                  />
                </div>
                {/* middle (LCP image) */}
                <div className="hero-book hero-spin-slow absolute inset-0 z-10 shadow-2xl">
                  <Image
                    src="/books/the_feminineFloklorSongs.png"
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
                    src="/books/alice.jpeg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 240px, 0px"
                    className="object-cover"
                  />
                </div>

                {/* Sparkles */}
                <svg className="animate-sparkle absolute -left-8 top-2 z-30 w-5 h-5 text-white/80" style={{ animationDelay: "1.2s" }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l1.2 4.2L17.4 3l-1.2 4.2L20.5 4l-1.2 4.2 3.8 1.3-4.2 1.2 1.2 4.2-4.2-1.2L16 18l-4.2-1.2L10.6 21l-1.2-4.2L5.5 20l1.2-4.2-3.8-1.3 4.2-1.2L5.9 4l4.2 1.2L11.3 2H12z" />
                </svg>

                {/* floating chip — rating */}
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

                {/* floating chip — single copy */}
                <div className="hero-float-2 absolute -right-8 bottom-16 z-30 px-4 py-2.5 rounded-2xl bg-primary text-white shadow-xl border border-white/10">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{isAr ? "نسخة واحدة فقط" : "עותק אחד בלבד"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Marquee ================= */}
      <Marquee items={marqueeItems} />

      {/* ================= Featured books ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {isAr ? "اختيارات مختارة" : "בחירות נבחרות"}
            </span>
            <h2 className="text-foreground">{dict.books.title}</h2>
            <p className="text-text-secondary mt-2 max-w-lg">{dict.books.subtitle}</p>
          </div>
          <Link
            href={`/${typedLang}/books`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-light transition-colors group"
          >
            {isAr ? "عرض كل الكتب" : "הצגת כל הספרים"}
            <svg
              className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <FeaturedBooks books={featured} lang={typedLang} dict={dict} />
      </section>

      {/* ================= Trust features ================= */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 cv-auto">
            {[
              { title: dict.trust["1t"], desc: dict.trust["1d"], icon: "M12 18.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zM12 3v3m0 12v3m9-9h-3M6 12H3" },
              { title: dict.trust["2t"], desc: dict.trust["2d"], icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" },
              { title: dict.trust["3t"], desc: dict.trust["3d"], icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-surface hover:bg-surface-alt hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:scale-105 transition-all duration-300">
                  <svg className="w-5 h-5 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* ================= Series highlights ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="text-center mb-10">
          <span className="eyebrow mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h10" />
            </svg>
            {isAr ? "مكتبة مركزّبة" : "חנות מאורגנת"}
          </span>
          <h2 className="text-foreground">{isAr ? "تسوّق حسب السلسلة" : "קניה לפי סדרה"}</h2>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            {isAr
              ? "كل سلسلة في مكانها — اختر السلسلة المناسبة لك وتصفح كتبها مباشرة."
              : "כל סדרה במקומה — בחרו את הסדרה המתאימה ועיינו בספריה."}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {seriesCards.map((s, i) => (
            <Link
              key={s.id}
              href={`/${typedLang}/books#${s.id}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface lift"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {s.cover ? (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <BookCover
                    src={s.cover}
                    alt={s.label}
                    className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-5xl font-display text-white/85">{s.label.charAt(0)}</span>
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <h3 className="font-bold text-white leading-snug line-clamp-2 drop-shadow-md">{s.label}</h3>
                <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold text-white/90">
                  {s.books.length} {isAr ? "كتب" : "ספרים"}
                  <svg className="w-3.5 h-3.5 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= Order note ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
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
      <BuyGuide lang={typedLang} />
    </>
  );
}
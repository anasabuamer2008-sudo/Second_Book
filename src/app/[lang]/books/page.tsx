import { getDictionary } from "@/dictionaries";
import { sampleBooks } from "@/lib/books";
import BookCatalog from "@/components/catalog/BookCatalog";

export default async function BooksPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BookStore",
    name: "Second Book",
    alternateName: dict.hero.title,
    availableLanguage: ["ar", "he"],
    url: `/books`,
    makesOffer: sampleBooks.map((b) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Book",
        name: b.title,
        author: { "@type": "Person", name: b.author },
      },
      price: b.price,
      priceCurrency: "ILS",
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: dict.nav.home, item: `/${typedLang}` },
      { "@type": "ListItem", position: 2, name: dict.books.title, item: `/${typedLang}/books` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ================= Header ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary border-b border-primary-dark/40">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 right-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/25 blur-3xl" />
          <span
            className="absolute bottom-0 left-6 text-[10rem] md:text-[14rem] leading-none font-display text-white/[0.05] select-none"
            dir="rtl"
          >
            {typedLang === "he" ? "ספרים" : "كتب"}
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm mb-4 fade-up">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {dict.hero.subtitle}
          </span>
          <h1 className="text-white mb-3 fade-up" style={{ animationDelay: "60ms" }}>
            {dict.books.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg mb-2 fade-up" style={{ animationDelay: "120ms" }}>
            {dict.books.subtitle}
          </p>
          <p className="text-white/60 text-sm fade-up" style={{ animationDelay: "180ms" }}>
            {dict.books.count}: <span className="font-bold text-white/80">{sampleBooks.length}</span>
          </p>
        </div>
      </section>

      <BookCatalog lang={typedLang} dict={dict} />
    </>
  );
}
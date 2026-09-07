"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getDictionary } from "@/dictionaries";
import { sampleBooks, sampleBundles } from "@/lib/books";
import BookCard from "@/components/ui/BookCard";
import BundleCard from "@/components/ui/BundleCard";
import Toast from "@/components/ui/Toast";

export default function BooksPage() {
  const { lang } = useParams<{ lang: string }>();
  const dict = getDictionary(lang as "ar" | "he");
  const typedLang = lang === "he" ? "he" : "ar";
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filteredBooks = sampleBooks.filter(
    (b) =>
      (filter === "all" || b.condition === filter) &&
      (!q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description || "").toLowerCase().includes(q))
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "BookStore",
    name: "Second Book",
    alternateName: dict.hero.title,
    availableLanguage: ["ar", "he"],
    url: "https://second-book.example.com/books",
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

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Page header */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{dict.books.title}</h1>
          <p className="text-white/80 text-base md:text-lg mb-6">{dict.books.subtitle}</p>
          <p className="text-white/70 text-sm">{dict.books.count}: {sampleBooks.length}</p>
        </div>
      </section>

      {/* Promo / Bundles Section */}
      <section id="promo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center gap-3 mb-2">
          <span className="bg-accent/15 text-accent-dark text-xs font-bold px-3 py-1 rounded-full">
            ₪
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{dict.promo.title}</h2>
        </div>
        <p className="text-text-secondary mb-8">{dict.promo.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBundles.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              dict={{ ...dict.promo }}
              isAr={typedLang === "ar"}
              onToast={setToastMsg}
            />
          ))}
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <h2 className="text-3xl font-bold text-foreground">{dict.books.title}</h2>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <svg
              className="w-5 h-5 absolute top-1/2 -translate-y-1/2 right-3.5 text-text-secondary pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.trust.searchPlaceholder}
              className="w-full pl-4 pr-11 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "all", label: dict.books.filterAll },
            { key: "like-new", label: dict.books.filterNew },
            { key: "good", label: dict.books.filterGood },
            { key: "acceptable", label: dict.books.filterAcceptable },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                filter === f.key
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface-alt text-text-secondary hover:bg-border"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                dict={dict}
                lang={typedLang}
                onToast={setToastMsg}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto text-border mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-text-secondary text-lg">
              {query ? dict.books.noResults : dict.books.noBooks}
            </p>
          </div>
        )}
      </section>
    </>
  );
}
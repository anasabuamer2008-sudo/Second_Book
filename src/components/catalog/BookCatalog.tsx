"use client";
import { useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/dictionaries";
import { sampleBooks, sampleBundles } from "@/lib/books";
import { bookSeries, seriesIdOf, seriesLabel } from "@/lib/books";
import { Book } from "@/store/useCartStore";
import BookCard from "@/components/ui/BookCard";
import BundleCard from "@/components/ui/BundleCard";
import BuyGuide from "@/components/ui/BuyGuide";
import Toast from "@/components/ui/Toast";
import dynamic from "next/dynamic";

const BookModal = dynamic(() => import("@/components/ui/BookModal"), { ssr: false });

type SortKey = "default" | "priceAsc" | "priceDesc";
type CatKey = "all" | string;

const CONDITIONS = ["all", "like-new", "good", "acceptable"] as const;

export default function BookCatalog({
  lang,
  dict,
}: {
  lang: "ar" | "he";
  dict: Dictionary;
}) {
  const typedLang = lang;
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [cat, setCat] = useState<CatKey>("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("default");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash && bookSeries.some((s) => s.id === hash)) setCat(hash);
    };
    const t = setTimeout(apply, 0);
    window.addEventListener("hashchange", apply);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", apply);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const counts = useMemo(() => {
    const q = debouncedQuery;
    const matches = (b: Book) =>
      (cat === "all" || seriesIdOf(b.id) === cat) &&
      (!q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description || "").toLowerCase().includes(q));
    return CONDITIONS.map((c) => ({
      key: c,
      count: sampleBooks.filter((b) => (c === "all" || b.condition === c) && matches(b)).length,
    }));
  }, [debouncedQuery, cat]);

  const filteredBooks = useMemo(() => {
    const q = debouncedQuery;
    let list = sampleBooks.filter(
      (b) =>
        (cat === "all" || seriesIdOf(b.id) === cat) &&
        (filter === "all" || b.condition === filter) &&
        (!q ||
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          (b.description || "").toLowerCase().includes(q))
    );
    if (cat === "all") {
      list = bookSeries.flatMap((s) =>
        s.bookIds
          .map((id) => list.find((b) => b.id === id))
          .filter((b): b is Book => Boolean(b))
      );
    }
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [debouncedQuery, filter, cat, sort]);

  const isGroupedDefault =
    cat === "all" &&
    filter === "all" &&
    !debouncedQuery &&
    sort === "default";

  const segments = useMemo(() => {
    if (!isGroupedDefault) return null;
    const remaining = new Set(filteredBooks.map((b) => b.id));
    return bookSeries
      .map((s) => ({
        id: s.id,
        labelAr: s.labelAr,
        labelHe: s.labelHe,
        books: s.bookIds
          .map((id) => sampleBooks.find((b) => b.id === id))
          .filter((b): b is Book => Boolean(b) && remaining.has((b as Book).id)),
      }))
      .filter((s) => s.books.length > 0);
  }, [filteredBooks, isGroupedDefault]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "default", label: dict.books.sortDefault },
    { key: "priceAsc", label: dict.books.priceAsc },
    { key: "priceDesc", label: dict.books.priceDesc },
  ];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* ================= Search + Toolbar ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between mb-8">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <svg
              className="w-5 h-5 absolute top-1/2 -translate-y-1/2 right-4 text-text-secondary pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.trust.searchPlaceholder}
              className="w-full pr-12 pl-4 py-3.5 bg-surface border border-border rounded-2xl text-foreground placeholder:text-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 -translate-y-1/2 left-3.5 w-6 h-6 rounded-full bg-surface-alt flex items-center justify-center text-text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-text-secondary whitespace-nowrap">
              {dict.books.sortBy}:
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="px-4 py-3 bg-surface border border-border rounded-xl text-sm font-medium text-foreground focus:ring-2 focus:ring-primary outline-none transition-all cursor-pointer shadow-sm"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= Categories ================= */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setCat("all")}
            aria-pressed={cat === "all"}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
              cat === "all"
                ? "bg-foreground text-background border-foreground shadow-md"
                : "bg-surface text-text-secondary border-border hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {dict.books.filterAll}
          </button>
          {bookSeries.map((s) => (
            <button
              key={s.id}
              onClick={() => setCat(s.id)}
              aria-pressed={cat === s.id}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                cat === s.id
                  ? "bg-foreground text-background border-foreground shadow-md"
                  : "bg-surface text-text-secondary border-border hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {seriesLabel(s.id, typedLang === "ar")}
            </button>
          ))}
        </div>

        {/* ================= Filter pills ================= */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "all", label: dict.books.filterAll },
            { key: "like-new", label: dict.books.filterNew },
            { key: "good", label: dict.books.filterGood },
            { key: "acceptable", label: dict.books.filterAcceptable },
          ].map((f) => {
            const count = counts.find((c) => c.key === f.key)?.count ?? 0;
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  active
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                    : "bg-surface text-text-secondary border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {f.label}
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-surface-alt text-text-secondary"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* Result count */}
          <span className="ms-auto inline-flex items-center gap-1.5 text-sm text-text-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {filteredBooks.length} {dict.books.results}
          </span>
        </div>

        {/* ================= Bundles ================= */}
        {sampleBundles.length > 0 && !debouncedQuery && (
          <section id="promo" className="mb-12 cv-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="eyebrow">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
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
        )}

        {/* ================= Books grid ================= */}
        <section id="books">
          {filteredBooks.length > 0 ? (
            segments ? (
              <div className="flex flex-col gap-10">
                {segments.map((seg, si) => (
                  <div key={seg.id} className="cv-auto">
                    <div className="flex items-center gap-4 mb-5">
                      <h3 className="font-extrabold text-foreground text-lg shrink-0">
                        {typedLang === "ar" ? seg.labelAr : seg.labelHe}
                      </h3>
                      <span className="h-px flex-1 bg-border" />
                      <span className="text-xs font-bold text-text-secondary">
                        {seg.books.length} {dict.books.results}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {seg.books.map((book, i) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          dict={dict.books}
                          onOpen={setSelectedBook}
                          index={si * 10 + i}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredBooks.map((book, i) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    dict={dict.books}
                    onOpen={setSelectedBook}
                    index={i}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-alt flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-1">
                {query ? dict.books.noResults : dict.books.noBooks}
              </h3>
              <p className="text-text-secondary text-sm mb-6">{dict.trust.searchPlaceholder}</p>
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                    setCat("all");
                    setSort("default");
                  }}
                  className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {typedLang === "ar" ? "مسح البحث والفلترة" : "ניקוי חיפוש וסינון"}
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ================= Buying guide ================= */}
      <BuyGuide lang={typedLang} />
    </>
  );
}
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useCartStore, Book } from "@/store/useCartStore";
import { getDictionary } from "@/dictionaries";
import BookCard from "@/components/ui/BookCard";
import Toast from "@/components/ui/Toast";
import dynamic from "next/dynamic";
import Link from "next/link";

const BookModal = dynamic(() => import("@/components/ui/BookModal"), { ssr: false });

export default function WishlistPage() {
  const { lang } = useParams<{ lang: string }>();
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const wishlist = useCartStore((s) => s.wishlist);
  const addToCart = useCartStore((s) => s.addToCart);
  const cart = useCartStore((s) => s.cart);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const addAllToCart = () => {
    const added = wishlist.filter((b) => !cart.some((c) => c.id === b.id));
    added.forEach((b) => addToCart(b));
    if (added.length > 0) setToastMsg(dict.wishlist.addedAllToCart);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-danger/10 flex items-center justify-center mb-6">
          <svg className="w-11 h-11 text-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">{dict.wishlist.title}</h1>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">{dict.wishlist.emptyDescription}</p>
        <Link
          href={`/${typedLang}/books`}
          className="inline-block px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-95"
        >
          {dict.wishlist.browseBooks}
        </Link>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <span className="eyebrow mb-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {dict.wishlist.eyebrow}
            </span>
            <h1 className="text-3xl font-bold text-foreground mb-1">{dict.wishlist.title}</h1>
            <p className="text-text-secondary text-sm">
              {wishlist.length} {wishlist.length > 1 ? dict.cart.items : dict.cart.item}
            </p>
          </div>
          <button
            onClick={addAllToCart}
            disabled={wishlist.every((b) => cart.some((c) => c.id === b.id))}
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light active:scale-95 disabled:opacity-50 transition-all duration-200 cursor-pointer"
          >
            {dict.wishlist.addAllToCart}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {wishlist.map((book, i) => (
            <BookCard
              key={book.id}
              book={book}
              dict={dict.books}
              onOpen={setSelectedBook}
              index={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}
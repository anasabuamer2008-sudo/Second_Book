"use client";
import { Book, useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import Book3D from "./Book3D";

interface BookCardProps {
  book: Book;
  dict: {
    books: {
      addToCart: string;
      addedToCart: string;
      condition: string;
      singleCopy: string;
      conditions: {
        "like-new": string;
        good: string;
        acceptable: string;
      };
      price: string;
    };
    toast: {
      addedToCart: string;
    };
  };
  lang: "ar" | "he";
  onToast?: (msg: string) => void;
}

const conditionStyles: Record<string, string> = {
  "like-new": "bg-emerald-50 text-emerald-700 border-emerald-200",
  good: "bg-blue-50 text-blue-700 border-blue-200",
  acceptable: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function BookCard({ book, dict, lang, onToast }: BookCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const [isAdded, setIsAdded] = useState(false);

  const isInCart = cart.some((b) => b.id === book.id);

  const handleAdd = () => {
    if (isInCart) return;
    addToCart(book);
    setIsAdded(true);
    onToast?.(dict.toast.addedToCart);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const conditionLabel =
    book.condition === "like-new"
      ? dict.books.conditions["like-new"]
      : book.condition === "good"
      ? dict.books.conditions.good
      : dict.books.conditions.acceptable;

  return (
    <div className="book-card bg-surface rounded-2xl border border-border overflow-hidden flex flex-col fade-up">
      {/* 3D Book Cover */}
      <div className="relative bg-gradient-to-b from-surface-alt to-border/50 overflow-hidden">
        <div className="h-48 flex items-center justify-center">
          <div className="w-28 md:w-32">
            <Book3D title={book.title} theme={parseInt(book.id)} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 border-t border-border">
        <div className="mb-3">
          <h3 className="font-bold text-foreground text-lg leading-snug line-clamp-2">
            {book.title}
          </h3>
          <p className="text-text-secondary text-sm mt-1">{book.author}</p>
        </div>

        {/* Condition + single copy badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${conditionStyles[book.condition]}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {conditionLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/20">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {dict.books.singleCopy}
          </span>
        </div>

        {book.description && (
          <p className="text-text-secondary text-xs mb-4 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/60">
          <div>
            <div className="text-xs text-text-secondary">{dict.books.price}</div>
            <div className="text-xl font-extrabold text-primary leading-tight">
              {book.price} ₪
            </div>
          </div>
          <button
            onClick={handleAdd}
            disabled={isInCart}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isInCart
                ? "bg-accent/15 text-accent cursor-default"
                : "bg-primary text-white hover:bg-primary-light active:scale-95 cursor-pointer"
            }`}
          >
            {isInCart ? dict.books.addedToCart : dict.books.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
}
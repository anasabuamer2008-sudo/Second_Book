"use client";

import { Bundle, sampleBooks, getBundleTotal } from "@/lib/books";
import { useCartStore } from "@/store/useCartStore";
import BookCover from "./BookCover";

type PromoDict = {
  save: string;
  insteadOf: string;
  addBundle: string;
  addedBundle: string;
  bundle: string;
  includes: string;
};

export default function BundleCard({
  bundle,
  dict,
  isAr,
  onToast,
}: {
  bundle: Bundle;
  dict: PromoDict;
  isAr: boolean;
  onToast: (msg: string) => void;
}) {
  const addToCart = useCartStore((s) => s.addToCart);
  const cart = useCartStore((s) => s.cart);

  const books = bundle.bookIds
    .map((id) => sampleBooks.find((b) => b.id === id))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  const original = getBundleTotal(bundle);
  const save = original - bundle.bundlePrice;
  const savedMoney = `${save} ₪`;
  const isInCart = cart.some((b) => b.id === `bundle-${bundle.id}`);

  const handleAdd = () => {
    if (isInCart) return;
    addToCart({
      id: `bundle-${bundle.id}`,
      title: isAr ? bundle.nameAr : bundle.nameHe,
      author: isAr ? "باقة كتب مختارة" : "חבילת ספרים נבחרת",
      price: bundle.bundlePrice,
      condition: "like-new",
      coverImage: "",
      description: `${isAr ? "تشمل" : "כוללת"}: ${books.map((b) => b.title).join(", ")}`,
    });
    onToast(isAr ? "تمت إضافة الباقة إلى السلة" : "החבילה נוספה לעגלה");
  };

  return (
    <div className="lift group relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Top gradient accent */}
      <div className="h-1.5 bg-gradient-to-r from-accent via-primary to-primary-dark" />

      {/* Visual */}
      <div className="relative">
        {bundle.coverImage ? (
          <BookCover
            src={bundle.coverImage}
            alt={isAr ? bundle.nameAr : bundle.nameHe}
            className="w-full aspect-[16/9]"
          />
        ) : (
          <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-surface-alt to-border/60 flex items-center justify-center px-6">
            {/* Spilled stack preview */}
            <div className="flex items-end justify-center h-28 gap-3">
              {books.slice(0, 5).map((book, i) => (
                <div
                  key={book.id}
                  className="w-14 h-[5.8rem] shrink-0"
                  style={{ transform: `rotate(${((i - 2) * 7)}deg) translateY(${Math.abs(i - 2) * 3}px)` }}
                >
                  <BookCover src={book.coverImage} alt={book.title} className="w-full h-full rounded-md shadow-lg" />
                </div>
              ))}
            </div>
            {/* count chip */}
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-extrabold text-foreground shadow-sm border border-border">
              {books.length} {dict.includes === "כוללת" ? "ספרים" : "كتب"}
            </span>
          </div>
        )}

        {/* Save ribbon */}
        {save > 0 && (
          <div className="absolute -bottom-3 right-4 px-3 py-1 rounded-full bg-success text-white text-xs font-extrabold shadow-md">
            {dict.save} {savedMoney}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 pt-5 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent-dark text-[11px] font-bold border border-accent/20">
            {dict.bundle}
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2">
          {isAr ? bundle.nameAr : bundle.nameHe}
        </h3>

        <ul className="space-y-1.5 flex-grow">
          {books.slice(0, 6).map((book) => (
            <li key={book.id} className="flex items-center gap-2 text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="line-clamp-1">{book.title}</span>
            </li>
          ))}
          {books.length > 6 && (
            <li className="text-xs font-semibold text-text-secondary">
              +{books.length - 6} {isAr ? "أخرى" : "נוספות"}
            </li>
          )}
        </ul>

        <div className="flex items-end justify-between mt-2">
          <div>
            <div className="text-xs text-text-secondary line-through mb-0.5">
              {dict.insteadOf} {original} ₪
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-primary leading-tight">{bundle.bundlePrice}</span>
              <span className="text-sm font-semibold text-text-secondary">₪</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={isInCart}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
            isInCart
              ? "bg-success/15 text-success"
              : "bg-primary text-white hover:bg-primary-light active:scale-[0.98] shadow-lg shadow-primary/20"
          }`}
        >
          {isInCart ? (isAr ? "أُضيفت الباقة" : "החבילה נוספה") : dict.addBundle}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Bundle, sampleBooks, getBundleTotal } from "@/lib/books";
import { useCartStore } from "@/store/useCartStore";

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
  const [added, setAdded] = useState(false);

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
    setAdded(true);
    onToast(isAr ? "تمت إضافة الباقة إلى السلة" : "החבילה נוספה לעגלה");
  };

  return (
    <div className="group relative bg-surface rounded-2xl border border-border p-6 flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-accent to-primary rounded-t-2xl" />

      <div className="flex items-center justify-between mb-4">
        <span className="bg-accent/15 text-accent-dark text-xs font-bold px-2.5 py-1 rounded-full">
          {dict.bundle}
        </span>
        <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
          {dict.save} {savedMoney}
        </span>
      </div>

      <h3 className="text-xl font-bold text-primary mb-4">
        {isAr ? bundle.nameAr : bundle.nameHe}
      </h3>

      <ul className="space-y-2 mb-5 flex-grow">
        {books.map((book) => (
          <li
            key={book.id}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
            {book.title}
            <span className="text-xs text-gray-400">({book.author})</span>
          </li>
        ))}
      </ul>

      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-sm text-gray-400 line-through mb-0.5">
            {dict.insteadOf} {original} ₪
          </div>
          <div className="text-2xl font-extrabold text-primary leading-tight">
            {bundle.bundlePrice} ₪
          </div>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={isInCart}
        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
          isInCart
            ? "bg-emerald-500 text-white cursor-default"
            : "bg-primary text-cream hover:bg-primary-dark active:scale-95"
        }`}
      >
        {isInCart ? (isAr ? "أُضيفت الباقة" : "החבילה נוספה") : dict.addBundle}
      </button>
    </div>
  );
}
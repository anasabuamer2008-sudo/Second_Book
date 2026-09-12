"use client";

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

const miniHeights = [108, 118, 112];
const miniRotations = [-12, -8, -15];

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
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border border-border bg-surface hover:shadow-lg transition-shadow duration-300">
      {/* Top ribbon */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent via-primary to-accent z-10" />

      {/* Wall + mini books on shelf */}
      <div className="shelf-wall relative pt-8 pb-2" style={{ minHeight: 180 }}>
        {/* decorative orbs */}
        <div className="wall-orb bg-white/15 w-10 h-10 top-2 left-4" />
        <div className="wall-orb bg-white/10 w-6 h-6 top-10 right-6" />

        {bundle.coverImage ? (
          <div className="relative flex items-center justify-center pb-2 px-4">
            <div className="relative w-40 h-56 overflow-hidden rounded-lg shadow-xl ring-1 ring-black/10 float-slow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bundle.coverImage}
                alt={isAr ? bundle.nameAr : bundle.nameHe}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bundle-ribbon swing-tag" />
          </div>
        ) : (
        <div className="relative flex items-end justify-center gap-1 pb-2 px-4">
          {books.slice(0, 4).map((book, i) => {
            const h = miniHeights[i % miniHeights.length];
            const ry = miniRotations[i % miniRotations.length];
            const hasImg = book.coverImage && /\.(png|jpe?g|webp)$/i.test(book.coverImage);

            return (
              <div
                key={book.id}
                className="book-stand"
                style={
                  {
                    "--bs-h": `${h}px`,
                    "--bs-depth": "14px",
                    "--bs-ry": `${ry}deg`,
                  } as React.CSSProperties
                }
              >
                <div className={`bs-inner ${i === 0 ? "float-slow" : ""}`}>
                  {hasImg ? (
                    <>
                      <div
                        className="bs-cover"
                        style={{ backgroundImage: `url(${book.coverImage})` }}
                      />
                      <div className="bs-spine" />
                      <div className="bs-top" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 rounded-[3px_9px_9px_3px]"
                      style={{
                        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                        transform: "translateZ(14px)",
                      }}
                    />
                  )}
                  {/* ribbon wrap on first book */}
                  {i === 0 && <div className="bundle-ribbon swing-tag" />}
                </div>
                <div className="bs-ground" />
              </div>
            );
          })}
          {books.length === 0 && (
            <div className="h-24 flex items-center text-text-secondary text-sm italic px-6">
              {isAr ? "باقة فارغة" : "חבילה ריקה"}
            </div>
          )}
        </div>
        )}

        {/* shelf plank */}
        <div className="shelf-wood" />
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-accent/15 text-accent-dark text-[11px] font-bold px-2.5 py-1 rounded-full">
            {dict.bundle}
          </span>
          <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            {dict.save} {savedMoney}
          </span>
        </div>

        <h3 className="text-lg font-bold text-primary mb-3 leading-snug">
          {isAr ? bundle.nameAr : bundle.nameHe}
        </h3>

        <ul className="space-y-1.5 mb-4 flex-grow">
          {books.map((book) => (
            <li
              key={book.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="line-clamp-1">{book.title}</span>
              <span className="text-[11px] text-gray-400 shrink-0">({book.author})</span>
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
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
            isInCart
              ? "bg-emerald-500 text-white cursor-default"
              : "bg-primary text-white hover:bg-primary-light active:scale-95"
          }`}
        >
          {isInCart ? (isAr ? "أُضيفت الباقة" : "החבילה נוספה") : dict.addBundle}
        </button>
      </div>
    </div>
  );
}
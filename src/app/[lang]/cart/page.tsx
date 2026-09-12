"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { getDictionary } from "@/dictionaries";
import { FREE_DELIVERY_THRESHOLD, getDeliveryFee } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import Toast from "@/components/ui/Toast";
import BookCover from "@/components/ui/BookCover";
import Link from "next/link";

export default function CartPage() {
  const { lang } = useParams<{ lang: string }>();
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const delivery = useCartStore((state) => state.delivery);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, book) => sum + book.price, 0);
  const deliveryFee = getDeliveryFee(delivery?.method, subtotal);
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <svg className="w-24 h-24 mx-auto text-border mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h1 className="text-2xl font-bold text-foreground mb-4">{dict.cart.empty}</h1>
        <p className="text-text-secondary mb-8">{dict.cart.emptyDescription}</p>
        <Link
          href={`/${lang}`}
          className="inline-block px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-95"
        >
          {dict.cart.browseBooks}
        </Link>
      </div>
    );
  }

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setToastMsg(dict.toast.removedFromCart);
  };

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">{dict.cart.title}</h1>
            <p className="text-text-secondary text-sm">
              {cart.length} {cart.length > 1 ? dict.cart.items : dict.cart.item}
            </p>
          </div>
          <Link
            href={`/${lang}/books`}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-light transition-colors"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
            {dict.cart.continueShopping}
          </Link>
        </div>

        {/* Free shipping progress */}
        <div className="mb-6 bg-surface rounded-2xl border border-border p-4">
          {remainingForFree > 0 ? (
            <>
              <div className="flex items-center justify-between text-xs mb-2 font-semibold">
                <span className="text-text-secondary">
                  {dict.cart.freeShippingRemaining}{" "}
                  <span className="text-primary font-extrabold">{formatPrice(remainingForFree, typedLang)}</span>{" "}
                  {dict.cart.freeShippingRemainingEnd}
                </span>
                <span className="text-primary font-extrabold">{dict.cart.freeShippingLabel}</span>
              </div>
              <div
                className="h-2 rounded-full bg-border overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={FREE_DELIVERY_THRESHOLD}
                aria-valuenow={subtotal}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${freeProgress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-sm font-bold text-success flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {dict.cart.freeShippingUnlocked}
            </p>
          )}
        </div>

        <div className="bg-surface rounded-2xl border border-border divide-y divide-border">
          {cart.map((book) => (
            <div key={book.id} className="flex items-center gap-4 p-4 md:p-5">
              <BookCover
                src={book.coverImage}
                alt={book.title}
                className="w-16 h-24 rounded-xl shrink-0 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{book.title}</h3>
                <p className="text-sm text-text-secondary">{book.author}</p>
              </div>
              <div className="font-bold text-primary whitespace-nowrap">
                {formatPrice(book.price, typedLang)}
              </div>
              <button
                onClick={() => handleRemove(book.id)}
                className="p-2 text-text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                aria-label={`${dict.cart.remove} ${book.title}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-surface rounded-2xl border border-border p-6 md:p-8">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>{dict.checkout.delivery}</span>
            <span className="font-semibold text-foreground">
              {delivery?.method === "delivery"
                ? dict.checkout.deliveryShipping
                : dict.checkout.deliveryPickup}
              <span className="text-xs text-text-secondary">
                {" "}— {deliveryFee > 0 ? formatPrice(deliveryFee, typedLang) : dict.checkout.free}
              </span>
            </span>
          </div>
          <p className="text-xs text-text-secondary text-primary/70 mb-6">{dict.cart.deliveryNote}</p>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center text-sm text-text-secondary">
              <span>{dict.checkout.subtotal}</span>
              <span>{formatPrice(subtotal, typedLang)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-text-secondary">
              <span>{dict.checkout.deliveryFee}</span>
              <span>{deliveryFee > 0 ? formatPrice(deliveryFee, typedLang) : dict.checkout.free}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-lg font-semibold text-foreground">
                {dict.cart.total} ({cart.length} {cart.length > 1 ? dict.cart.items : dict.cart.item})
              </span>
              <span className="text-3xl font-extrabold text-primary">
                {formatPrice(total, typedLang)}
              </span>
            </div>
          </div>
          <button
            onClick={() => router.push(`/${lang}/checkout`)}
            className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            {dict.cart.checkout}
          </button>
        </div>
      </div>
    </>
  );
}
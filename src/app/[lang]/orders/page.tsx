"use client";
import { useParams } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { getDictionary } from "@/dictionaries";
import { formatDate, formatPrice } from "@/lib/format";
import Toast from "@/components/ui/Toast";
import BookCover from "@/components/ui/BookCover";
import { useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const { lang } = useParams<{ lang: string }>();
  const dict = getDictionary(lang as "ar" | "he");
  const typedLang = lang === "he" ? "he" : "ar";
  const orders = useCartStore((state) => state.orders);
  const clearOrders = useCartStore((state) => state.clearOrders);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeOrder = useCartStore((state) => state.removeOrder);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleClear = () => {
    if (window.confirm(dict.orders.clearConfirm)) {
      clearOrders();
      setToastMsg(dict.orders.cleared);
    }
  };

  const handleRemoveOrder = (id: string) => {
    if (window.confirm(dict.orders.removeConfirm)) {
      removeOrder(id);
      setToastMsg(dict.orders.removed);
    }
  };

  const handleReorder = (items: { id: string; title: string; author: string; price: number; condition: "like-new" | "good" | "acceptable"; coverImage: string; description?: string }[]) => {
    items.forEach((book) => addToCart(book));
    setToastMsg(dict.toast.addedToCart);
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
        <svg className="w-24 h-24 mx-auto text-border mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h1 className="text-2xl font-bold text-foreground mb-4">{dict.orders.empty}</h1>
        <p className="text-text-secondary mb-8">{dict.orders.emptyDescription}</p>
        <Link
          href={`/${lang}`}
          className="inline-block px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-95"
        >
          {dict.cart.browseBooks}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{dict.orders.title}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {orders.length} · {dict.orders.statusPending}
          </p>
        </div>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-danger/10 text-danger text-sm font-bold rounded-xl hover:bg-danger/20 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {dict.orders.clearAll}
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <article
            key={order.id}
            className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 rounded-xl px-4 py-2">
                  <span className="text-primary font-bold">#{order.id}</span>
                </div>
                <div className="text-sm text-text-secondary space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(order.createdAt, typedLang)}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {dict.orders.status}: {dict.orders.statusPending}
                  </p>
                </div>
              </div>
              <div className="font-extrabold text-primary text-xl">
                {formatPrice(order.total, typedLang)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <button
                onClick={() => handleReorder(order.items)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary text-sm font-bold rounded-xl hover:bg-primary/20 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a8 8 0 0114.93-1M20 15a8 8 0 01-14.93 1" />
                </svg>
                {dict.orders.reorder}
              </button>
              <button
                onClick={() => handleRemoveOrder(order.id)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-danger/10 text-danger text-sm font-bold rounded-xl hover:bg-danger/20 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {dict.orders.removeOrder}
              </button>
            </div>

            {/* Delivery info */}
            {order.delivery && (
              <div className="mb-5 flex flex-wrap items-center gap-3 bg-surface-alt/60 rounded-xl px-4 py-3">
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-primary/10 text-primary">
                  {order.delivery.method === "delivery"
                    ? dict.orders.deliveryMethod
                    : dict.orders.pickupMethod}
                </span>
                {order.delivery.method === "delivery" && order.delivery.address && (
                  <span className="text-sm text-text-secondary truncate max-w-full">
                    {dict.checkout.deliveryAddress}: {order.delivery.address}
                  </span>
                )}
                <span className="text-sm text-text-secondary">
                  {dict.orders.deliveryFee}: {order.deliveryFee ? formatPrice(order.deliveryFee, typedLang) : dict.orders.free}
                </span>
              </div>
            )}

            {typeof order.subtotal === "number" && (
              <div className="mb-5 flex justify-end gap-6 text-sm text-text-secondary">
                <span>
                  {dict.orders.subtotal}: <strong className="text-foreground font-semibold">{formatPrice(order.subtotal, typedLang)}</strong>
                </span>
                <span>
                  {dict.orders.deliveryFee}:{" "}
                  <strong className="text-foreground font-semibold">
                    {order.deliveryFee ? formatPrice(order.deliveryFee, typedLang) : dict.orders.free}
                  </strong>
                </span>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">{dict.orders.items}</p>
              <div className="divide-y divide-border border-t border-border">
                {order.items.map((book) => (
                  <div key={book.id} className="flex items-center gap-3 py-2.5">
                    <BookCover
                      src={book.coverImage}
                      alt={book.title}
                      className="w-8 h-11 rounded shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                      <p className="text-xs text-text-secondary truncate">{book.author}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      {formatPrice(book.price, typedLang)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useCartStore, Order } from "@/store/useCartStore";
import { getDictionary } from "@/dictionaries";
import { DELIVERY_FEE } from "@/lib/books";
import Toast from "@/components/ui/Toast";
import Link from "next/link";

export default function CheckoutPage() {
  const { lang } = useParams<{ lang: string }>();
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const cart = useCartStore((state) => state.cart);
  const addOrder = useCartStore((state) => state.addOrder);
  const clearCart = useCartStore((state) => state.clearCart);
  const delivery = useCartStore((state) => state.delivery);
  const setDelivery = useCartStore((state) => state.setDelivery);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [lastOrder, setLastOrder] = useState<{ id: string; total: number } | null>(null);
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    phone: string;
    contactLanguage: "ar" | "he";
  }>({
    fullName: "",
    email: "",
    phone: "",
    contactLanguage: typedLang,
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    delivery?.method === "delivery" ? "delivery" : "pickup"
  );
  const [address, setAddress] = useState(delivery?.address ?? "");

  const subtotal = cart.reduce((sum, book) => sum + book.price, 0);
  const deliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;
  const currency = "₪";

  if (cart.length === 0 && !success) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <svg className="w-24 h-24 mx-auto text-border mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h1 className="text-2xl font-bold text-foreground mb-4">{dict.cart.empty}</h1>
        <p className="text-text-secondary mb-8">{dict.cart.emptyDescription}</p>
        <Link
          href={`/${typedLang}`}
          className="inline-block px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-95"
        >
          {dict.cart.browseBooks}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">{dict.checkout.success}</h1>
        <p className="text-text-secondary text-lg mb-2">{dict.checkout.successDescription}</p>
        {lastOrder && (
          <p className="text-sm text-primary font-semibold mb-8">
            {dict.orders.orderNumber}: #{lastOrder.id}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href={`/${typedLang}`}
            className="inline-flex items-center justify-center px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200"
          >
            {dict.hero.cta}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      setToastMsg(dict.toast.fillRequired);
      return;
    }
    if (deliveryMethod === "delivery" && !address.trim()) {
      setToastMsg(dict.toast.fillRequired);
      return;
    }

    setSending(true);

    const now = new Date();
    const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate()
    ).padStart(2, "0")}`;
    const rand = uuidv4().slice(0, 4).toUpperCase();
    const id = `BK-${ymd}-${rand}`;

    const order: Order = {
      id,
      items: cart,
      subtotal,
      deliveryFee,
      total,
      customer: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        language: form.contactLanguage,
      },
      delivery: {
        method: deliveryMethod,
        address: deliveryMethod === "delivery" ? address.trim() : undefined,
      },
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch("/api/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch {
      // Email failure shouldn't block the order flow
    }

    addOrder(order);
    clearCart();
    setLastOrder({ id, total });
    setSending(false);
    setSuccess(true);
    setToastMsg(dict.toast.orderPlaced);
  };

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">{dict.checkout.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Form */}
          <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {typedLang === "ar" ? "معلومات العميل والتوصيل" : "פרטי הלקוח והמשלוח"}
            </h2>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{dict.checkout.fullName}</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder={dict.checkout.fullNamePlaceholder}
                className="w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{dict.checkout.email}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={dict.checkout.emailPlaceholder}
                className="w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{dict.checkout.phone}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={dict.checkout.phonePlaceholder}
                className="w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{dict.checkout.preferredLanguage}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, contactLanguage: "ar" })}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer ${
                    form.contactLanguage === "ar"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-text-secondary hover:border-primary/50"
                  }`}
                >
                  {dict.checkout.langArabic}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, contactLanguage: "he" })}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 cursor-pointer ${
                    form.contactLanguage === "he"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-text-secondary hover:border-primary/50"
                  }`}
                >
                  {dict.checkout.langHebrew}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">{dict.checkout.delivery}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod("pickup");
                    setDelivery({ method: "pickup", address: address });
                  }}
                  className={`px-4 py-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                    deliveryMethod === "pickup"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className={`block text-sm font-bold ${deliveryMethod === "pickup" ? "text-primary" : "text-foreground"}`}>
                    {dict.checkout.deliveryPickup}
                  </span>
                  <span className="block text-xs mt-0.5 text-text-secondary">
                    {dict.checkout.deliveryPickupDesc} — {dict.checkout.free}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryMethod("delivery");
                    setDelivery({ method: "delivery", address: address });
                  }}
                  className={`px-4 py-3 rounded-xl border-2 text-center transition-all duration-200 cursor-pointer ${
                    deliveryMethod === "delivery"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className={`block text-sm font-bold ${deliveryMethod === "delivery" ? "text-primary" : "text-foreground"}`}>
                    {dict.checkout.deliveryShipping}
                  </span>
                  <span className="block text-xs mt-0.5 text-text-secondary">
                    {dict.checkout.deliveryShippingDesc} — {DELIVERY_FEE} ₪
                  </span>
                </button>
              </div>
            </div>
            {deliveryMethod === "delivery" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">{dict.checkout.deliveryAddress}</label>
                <textarea
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setDelivery({ method: "delivery", address: e.target.value });
                  }}
                  placeholder={dict.checkout.deliveryAddressPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-alt border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-light transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {sending ? dict.checkout.sending : dict.checkout.submit}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 h-fit lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-foreground mb-6">{dict.checkout.orderSummary}</h2>
            <div className="space-y-4 divide-y divide-border">
              {cart.map((book) => (
                <div key={book.id} className="flex items-center gap-4 pt-4 first:pt-0">
                  <div className="w-12 h-16 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">{book.title.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{book.title}</p>
                    <p className="text-xs text-text-secondary truncate">{book.author}</p>
                  </div>
                  <span className="font-semibold text-primary whitespace-nowrap">{book.price} {currency}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <div className="flex justify-between items-center text-sm text-text-secondary">
                <span>{dict.checkout.subtotal}</span>
                <span>{subtotal} {currency}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-text-secondary">
                <span>{dict.checkout.deliveryFee}</span>
                <span>
                  {deliveryFee > 0 ? `${deliveryFee} ${currency}` : dict.checkout.free}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-lg font-semibold text-foreground">{dict.cart.total}</span>
                <span className="text-2xl font-extrabold text-primary">{total} {currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
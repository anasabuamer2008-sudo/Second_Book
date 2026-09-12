"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { FREE_DELIVERY_THRESHOLD, getDeliveryFee } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import BookCover from "./BookCover";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  dict: {
    cart: {
      title: string;
      empty: string;
      emptyDescription: string;
      browseBooks: string;
      total: string;
      checkout: string;
      remove: string;
      items: string;
      item: string;
      continueShopping: string;
      freeShippingLabel: string;
      freeShippingRemaining: string;
      freeShippingRemainingEnd: string;
      freeShippingUnlocked: string;
    };
    checkout: {
      deliveryFee: string;
      free: string;
    };
    orders: {
      deliveryMethod: string;
      pickupMethod: string;
    };
  };
  lang: "ar" | "he";
}

export default function CartDrawer({ open, onClose, dict, lang }: CartDrawerProps) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const cart = useCartStore((s) => s.cart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const delivery = useCartStore((s) => s.delivery);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const panel = panelRef.current;
      const el = panel?.querySelector<HTMLElement>("[data-autofocus], button, a, input, select, textarea");
      el?.focus?.();
    }, 350);
    return () => clearTimeout(timer);
  }, [open]);

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const subtotal = cart.reduce((sum, b) => sum + b.price, 0);
  const deliveryFee = getDeliveryFee(delivery?.method, subtotal);
  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const freeProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  const goCheckout = () => {
    onClose();
    router.push(`/${lang}/checkout`);
  };

  const goBrowse = () => {
    onClose();
    router.push(`/${lang}/books`);
  };

  return (
    <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 drawer-backdrop" : "opacity-0"
        }`}
      />

      {/* Panel — slides from the end (right in RTL) */}
      <aside
        ref={panelRef}
        id="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={dict.cart.title}
        tabIndex={-1}
        onKeyDown={onPanelKeyDown}
        className={`absolute top-0 bottom-0 right-0 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface">
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {dict.cart.title}
            {cart.length > 0 && (
              <span
                className="text-xs font-extrabold bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center"
                aria-label={`${cart.length} ${dict.cart.items}`}
              >
                {cart.length}
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-alt transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-surface-alt flex items-center justify-center">
              <svg className="w-9 h-9 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-foreground">{dict.cart.empty}</p>
              <p className="text-sm text-text-secondary mt-1">{dict.cart.emptyDescription}</p>
            </div>
            <button
              data-autofocus
              onClick={goBrowse}
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {dict.cart.browseBooks}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* Free shipping progress */}
              <div className="px-5 pt-4 pb-3 border-b border-border bg-surface">
                {remainingForFree > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs mb-2 font-semibold">
                      <span className="text-text-secondary">
                        {dict.cart.freeShippingRemaining}{" "}
                        <span className="text-primary font-extrabold">{formatPrice(remainingForFree, lang)}</span>{" "}
                        {dict.cart.freeShippingRemainingEnd}
                      </span>
                      <span className="text-primary font-extrabold">{dict.cart.freeShippingLabel}</span>
                    </div>
                    <div
                      className="h-1.5 rounded-full bg-border overflow-hidden"
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
                  <p className="text-xs font-bold text-success flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {dict.cart.freeShippingUnlocked}
                  </p>
                )}
              </div>

              <div className="divide-y divide-border">
                {cart.map((book) => (
                  <div key={book.id} className="flex items-center gap-3 p-4">
                    <BookCover
                      src={book.coverImage}
                      alt={book.title}
                      className="w-14 h-[4.2rem] rounded-lg shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">{book.title}</p>
                      <p className="text-xs text-text-secondary truncate mt-0.5">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-extrabold text-primary">{formatPrice(book.price, lang)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(book.id)}
                      aria-label={`${dict.cart.remove} ${book.title}`}
                      className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border bg-surface space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>{dict.checkout.deliveryFee}</span>
                  <span className={deliveryFee > 0 ? "font-semibold text-foreground" : "text-success font-semibold"}>
                    {deliveryFee > 0 ? formatPrice(deliveryFee, lang) : dict.checkout.free}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-bold text-foreground">
                    {dict.cart.total} ({cart.length} {cart.length > 1 ? dict.cart.items : dict.cart.item})
                  </span>
                  <span className="text-2xl font-extrabold text-primary">{formatPrice(total, lang)}</span>
                </div>
              </div>
              <button
                onClick={goCheckout}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-light active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-primary/20"
              >
                {dict.cart.checkout}
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 text-sm font-semibold text-text-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                {dict.cart.continueShopping}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
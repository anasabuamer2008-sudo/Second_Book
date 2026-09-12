"use client";
import { Book, useCartStore } from "@/store/useCartStore";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  lang: "ar" | "he";
  dict: {
    books: {
      addToCart: string;
      addedToCart: string;
      buyNow: string;
      deliveryAvailable: string;
      condition: string;
      price: string;
      conditions: { "like-new": string; good: string; acceptable: string };
    };
    toast: {
      addedToCart: string;
    };
  };
  onToast?: (msg: string) => void;
}

export default function BookModal({ book, onClose, lang, dict, onToast }: BookModalProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const wishlist = useCartStore((state) => state.wishlist);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();

  const isInCart = book ? cart.some((b) => b.id === book.id) : false;
  const isWished = book ? wishlist.some((b) => b.id === book.id) : false;
  const hasImage = book?.coverImage && /\.(png|jpe?g|webp)$/i.test(book.coverImage);

  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
      previousFocus.current = document.activeElement as HTMLElement | null;
      const raf = requestAnimationFrame(() => {
        overlayRef.current?.classList.add("opacity-100");
        cardRef.current?.classList.add("scale-100", "translate-y-0");
        cardRef.current?.classList.remove("scale-90", "translate-y-8");
        setTimeout(() => {
          sceneRef.current?.classList.add("book-modal-open");
        }, 200);
        setTimeout(() => {
          cardRef.current?.querySelector<HTMLElement>("button, a, [tabindex]")?.focus?.();
        }, 80);
      });
      return () => {
        cancelAnimationFrame(raf);
        document.body.style.overflow = "";
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [book]);

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !cardRef.current) return;
    const focusable = cardRef.current.querySelectorAll<HTMLElement>(`button, a[href], [tabindex]:not([tabindex="-1"])`);
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

  const handleClose = useCallback(() => {
    sceneRef.current?.classList.remove("book-modal-open");
    overlayRef.current?.classList.remove("opacity-100");
    cardRef.current?.classList.remove("scale-100", "translate-y-0");
    cardRef.current?.classList.add("scale-90", "translate-y-8");
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      onClose();
      previousFocus.current?.focus?.();
    }, 350);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleAdd = () => {
    if (!book || isInCart) return;
    addToCart(book);
    onToast?.(dict.toast.addedToCart);
  };

  const handleBuyNow = () => {
    if (!book) return;
    if (!isInCart) {
      addToCart(book);
      onToast?.(dict.toast.addedToCart);
    }
    handleClose();
    router.push(`/${lang}/checkout`);
  };

  if (!book) return null;

  const rating = 4 + ((parseInt(book.id) || 1) % 2 === 0 ? 0.5 : 0);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 opacity-0 transition-opacity duration-350"
      onClick={handleClose}
      onKeyDown={trapFocus}
      role="dialog"
      aria-modal="true"
      aria-label={book.title}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        ref={cardRef}
        className="book-modal relative z-10 w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden scale-90 translate-y-8 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-surface/85 backdrop-blur flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-alt transition-all duration-200 cursor-pointer shadow-sm"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* 3D Book */}
          <div className="md:w-2/5 flex items-center justify-center p-8 md:p-10 bg-gradient-to-br from-surface-alt/60 to-surface">
            <div className="book-modal-3d" style={{ perspective: "1200px" }}>
              <div ref={sceneRef} className="book-modal-scene">
                <div className="book-modal-spine">
                  {hasImage && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${book.coverImage})`, filter: "brightness(0.6)" }}
                    />
                  )}
                </div>
                <div className="book-modal-cover">
                  {hasImage ? (
                    <div
                      className="w-full h-full bg-cover bg-center rounded-r-xl"
                      style={{ backgroundImage: `url(${book.coverImage})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 rounded-r-xl bg-gradient-to-br from-primary to-primary-dark text-white p-4">
                      <svg className="w-12 h-12 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM4 18V6h7v12H4zm9 0V6h7v12h-7z" />
                      </svg>
                      <span className="font-bold text-sm text-center leading-tight line-clamp-4">{book.title}</span>
                    </div>
                  )}
                  <div className="book-modal-pages" />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col gap-4">
            {/* Condition + single copy */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent/15 text-accent-dark border border-accent/20">
                {dict.books.conditions[book.condition]}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/15">
                {dict.books.deliveryAvailable}
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">{book.title}</h2>

            <p className="text-sm text-text-secondary flex items-center gap-2">
              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {book.author}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5 text-accent">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className="w-4 h-4" fill={s <= Math.floor(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </span>
              <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
              <span className="text-xs text-text-secondary">
                · {12 + ((parseInt(book.id) || 1) * 7) % 40}
              </span>
            </div>

            <div className="w-12 h-0.5 bg-accent/40 rounded-full" />

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-5">
              {book.description || dict.books.deliveryAvailable}
            </p>

            {/* Price + CTAs */}
            <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-border">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-primary">{book.price}</span>
                <span className="text-sm font-semibold text-text-secondary">₪</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    toggleWishlist(book);
                  }}
                  aria-label={isWished ? "remove from wishlist" : "add to wishlist"}
                  aria-pressed={isWished}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                    isWished
                      ? "bg-danger text-white border-danger"
                      : "bg-surface text-text-secondary border-border hover:text-danger hover:border-danger/40"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-5 py-3 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  {dict.books.buyNow}
                </button>
                <button
                  onClick={handleAdd}
                  disabled={isInCart}
                  className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                    isInCart
                      ? "bg-success/15 text-success"
                      : "bg-primary text-white hover:bg-primary-light active:scale-95 shadow-lg shadow-primary/25"
                  }`}
                >
                  {isInCart ? dict.books.addedToCart : dict.books.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
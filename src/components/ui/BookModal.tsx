"use client";
import { Book, useCartStore } from "@/store/useCartStore";
import { useEffect, useRef, useCallback } from "react";

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  dict: {
    books: {
      addToCart: string;
      addedToCart: string;
    };
    toast: {
      addedToCart: string;
    };
  };
  onToast?: (msg: string) => void;
}

export default function BookModal({ book, onClose, dict, onToast }: BookModalProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isInCart = book ? cart.some((b) => b.id === book.id) : false;
  const hasImage = book?.coverImage && /\.(png|jpe?g|webp)$/i.test(book.coverImage);

  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
      const raf = requestAnimationFrame(() => {
        overlayRef.current?.classList.add("opacity-100");
        cardRef.current?.classList.add("scale-100", "translate-y-0");
        cardRef.current?.classList.remove("scale-90", "translate-y-8");
        setTimeout(() => {
          sceneRef.current?.classList.add("book-modal-open");
        }, 200);
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

  const handleClose = useCallback(() => {
    sceneRef.current?.classList.remove("book-modal-open");
    overlayRef.current?.classList.remove("opacity-100");
    cardRef.current?.classList.remove("scale-100", "translate-y-0");
    cardRef.current?.classList.add("scale-90", "translate-y-8");
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(onClose, 350);
  }, [onClose]);

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

  if (!book) return null;

  const conditionLabel =
    book.condition === "like-new"
      ? "كما الجديد"
      : book.condition === "good"
        ? "جيد جداً"
        : "مقبول";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-0 transition-opacity duration-350"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div
        ref={cardRef}
        className="book-modal relative z-10 w-full max-w-2xl bg-surface rounded-3xl shadow-2xl overflow-hidden scale-90 translate-y-8 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full bg-surface-alt/80 backdrop-blur-sm flex items-center justify-center text-text-secondary hover:text-foreground hover:bg-surface-alt transition-all duration-200 cursor-pointer"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* 3D Book Section */}
          <div className="md:w-2/5 flex items-center justify-center p-8 md:p-10 bg-gradient-to-br from-surface-alt/50 to-surface">
            <div
              className="book-modal-3d"
              style={{ perspective: "1200px" }}
            >
              <div ref={sceneRef} className="book-modal-scene">
                {/* Book spine (left side) */}
                <div className="book-modal-spine">
                  {hasImage && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${book.coverImage})`, filter: "brightness(0.6)" }}
                    />
                  )}
                </div>

                {/* Book cover (front) */}
                <div className="book-modal-cover">
                  {hasImage ? (
                    <div
                      className="w-full h-full bg-cover bg-center rounded-r-2xl"
                      style={{ backgroundImage: `url(${book.coverImage})` }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 rounded-r-2xl bg-gradient-to-br from-primary to-primary-dark text-white p-4">
                      <svg className="w-12 h-12 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM4 18V6h7v12H4zm9 0V6h7v12h-7zM6 8h3v2H6V8zm0 4h3v2H6v-2zm0 4h3v2H6v-2zm5-8h4v2h-4V8zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z" />
                      </svg>
                      <span className="font-bold text-sm text-center leading-tight line-clamp-4">{book.title}</span>
                    </div>
                  )}
                  {/* Pages edge visible when open */}
                  <div className="book-modal-pages" />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:w-3/5 p-6 md:p-8 flex flex-col gap-4">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug">{book.title}</h2>

            {/* Author */}
            <p className="text-sm text-text-secondary flex items-center gap-2">
              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {book.author}
            </p>

            {/* Divider */}
            <div className="w-12 h-0.5 bg-accent/40 rounded-full" />

            {/* Description */}
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-5">
              {book.description || "كتاب مميز من مكتبتنا، بحالة ممتازة وجاهز للتوصيل."}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-1">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">
                {conditionLabel}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                التوصيل متوفر
              </span>
            </div>

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
              <div>
                <span className="text-2xl font-extrabold text-primary">{book.price} ₪</span>
              </div>
              <button
                onClick={handleAdd}
                disabled={isInCart}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${
                  isInCart
                    ? "bg-accent/15 text-accent cursor-default"
                    : "bg-primary text-white hover:bg-primary-light active:scale-95 shadow-lg shadow-primary/25 hover:shadow-primary/40"
                }`}
              >
                {isInCart ? dict.books.addedToCart : dict.books.addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { Book } from "@/store/useCartStore";
import { useCartStore } from "@/store/useCartStore";
import BookCover from "./BookCover";

export interface BookCardDict {
  addToCart: string;
  addedToCart: string;
  condition: string;
  price: string;
  singleCopy: string;
  conditions: { "like-new": string; good: string; acceptable: string };
  currency?: string;
}

interface BookCardProps {
  book: Book;
  dict: BookCardDict;
  onOpen: (book: Book) => void;
  index?: number;
}

export default function BookCard({ book, dict, onOpen, index = 0 }: BookCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);
  const cart = useCartStore((s) => s.cart);
  const wishlist = useCartStore((s) => s.wishlist);
  const toggleWishlist = useCartStore((s) => s.toggleWishlist);

  const isInCart = cart.some((b) => b.id === book.id);
  const isWished = wishlist.some((b) => b.id === book.id);

  const num = parseInt(book.id) || index || 1;
  const rating = 4 + (num % 2 === 0 ? 0.5 : 0);
  const reviews = 12 + ((num * 7) % 40);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) return;
    addToCart(book);
  };

  return (
    <article
      onClick={() => onOpen(book)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(book);
        }
      }}
      className="lift group relative flex flex-col rounded-2xl border border-border bg-surface overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
    >
      {/* Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <BookCover
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Condition badge */}
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-bold bg-background/90 backdrop-blur-sm text-primary shadow-sm">
          {dict.conditions[book.condition]}
        </span>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(book);
          }}
          aria-label={isWished ? "remove from wishlist" : "add to wishlist"}
          aria-pressed={isWished}
          className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 cursor-pointer shadow-sm ${
            isWished
              ? "bg-danger text-white"
              : "bg-background/85 text-text-secondary hover:text-danger hover:bg-background"
          }`}
        >
          <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Hover reveal — single copy */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-10 text-[11px] text-white font-semibold">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {dict.singleCopy}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-foreground text-sm leading-snug line-clamp-2 min-h-[2.6em]">
          {book.title}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-1">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5" aria-label={`${rating} / 5`}>
          <span className="flex items-center gap-0.5 text-accent">
            {[1, 2, 3, 4, 5].map((s) => {
              const filled = s <= Math.floor(rating);
              const half = !filled && s === Math.ceil(rating) && rating % 1 !== 0;
              return (
                <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id={`starHalf-${book.id}-${s}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <path
                    fill={filled ? "currentColor" : half ? `url(#starHalf-${book.id}-${s})` : "transparent"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                  />
                </svg>
              );
            })}
          </span>
          <span className="text-[11px] text-text-secondary">
            {rating.toFixed(1)} · {reviews}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-2 border-t border-border flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-primary">{book.price}</span>
            <span className="text-xs font-semibold text-text-secondary">₪</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={isInCart}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isInCart
                ? "bg-success/15 text-success"
                : "bg-primary text-white hover:bg-primary-light hover:shadow-md hover:shadow-primary/25 active:scale-95"
            }`}
          >
            {isInCart ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {dict.addedToCart}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {dict.addToCart}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
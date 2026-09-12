"use client";
import { Book } from "@/store/useCartStore";
import { useInView } from "@/hooks/useInView";

interface ShelfBookProps {
  book: Book;
  dict: {
    books: {
      addToCart: string;
      addedToCart: string;
    };
    toast: {
      addedToCart: string;
    };
  };
  onBookClick?: (book: Book) => void;
  delay?: number;
  h?: number;
  ry?: number;
}

export default function ShelfBook({ book, onBookClick, delay = 0, h = 170, ry = -12 }: ShelfBookProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.05);
  const hasImage = book.coverImage && /\.(png|jpe?g|webp)$/i.test(book.coverImage);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in-view" : ""} group relative flex flex-col items-center cursor-pointer`}
      style={{ animationDelay: `${Math.min(delay, 400)}ms` }}
      onClick={() => onBookClick?.(book)}
    >
      {/* standing 3D book */}
      <div
        className="book-stand"
        style={
          {
            "--bs-h": `${h}px`,
            "--bs-depth": "18px",
            "--bs-ry": `${ry}deg`,
          } as React.CSSProperties
        }
      >
        <div className="bs-inner">
          {hasImage ? (
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
                transform: "translateZ(18px)",
              }}
            />
          )}
          {/* price tag hanging */}
          <div className="bs-tag">{book.price} ₪</div>
        </div>
        <div className="bs-ground" />
      </div>

      {/* click hint */}
      <div className="mt-2 text-[10px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
       اضغط للتفاصيل
      </div>
    </div>
  );
}

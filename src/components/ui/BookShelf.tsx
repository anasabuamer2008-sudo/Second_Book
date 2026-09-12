"use client";
import { Book } from "@/store/useCartStore";
import ShelfBook from "./ShelfBook";

type ShelfDict = {
  books: {
    addToCart: string;
    addedToCart: string;
  };
  toast: {
    addedToCart: string;
  };
};

interface ShelfRowProps {
  books: Book[];
  dict: ShelfDict;
  onBookClick?: (book: Book) => void;
  shelfIndex: number;
}

/* One wooden shelf : several standing books on a shared plank */
export function ShelfRow({ books, dict, onBookClick, shelfIndex }: ShelfRowProps) {
  const heights = [150, 168, 182, 174, 158, 176, 164, 146, 170, 160];
  const rotations = [-9, -14, -12, -7, -16, -11, -8, -13, -10, -15];

  return (
    <div className="bookcase-bay relative">
      <div className="bookcase-shelf" style={{ minHeight: 190 }}>
        {books.map((book, i) => {
          const num = parseInt(book.id) || 0;
          return (
            <div
              key={book.id}
              className="relative"
              style={{ width: `${100 / Math.min(books.length, 6)}%`, minWidth: 110 }}
            >
              <ShelfBook
                book={book}
                dict={dict}
                onBookClick={onBookClick}
                delay={shelfIndex * 60 + i * 30}
                h={heights[(num + shelfIndex) % heights.length]}
                ry={rotations[(num + i) % rotations.length]}
              />
            </div>
          );
        })}
      </div>
      <div className="bookshelf-plank" />
    </div>
  );
}

/* The whole bookcase: a tall wooden cabinet with several shelves */
export default function Bookcase({
  books,
  dict,
  onBookClick,
}: {
  books: Book[];
  dict: ShelfDict;
  onBookClick?: (book: Book) => void;
}) {
  const perShelf = 6;
  const rows: Book[][] = [];
  for (let i = 0; i < books.length; i += perShelf) {
    rows.push(books.slice(i, i + perShelf));
  }

  return (
    <div className="bookcase w-full max-w-6xl mx-auto">
      <div className="relative flex flex-col gap-6">
        {rows.map((row, idx) => (
          <ShelfRow
            key={idx}
            books={row}
            dict={dict}
            onBookClick={onBookClick}
            shelfIndex={idx}
          />
        ))}
      </div>
    </div>
  );
}

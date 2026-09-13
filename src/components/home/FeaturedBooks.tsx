"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import Toast from "@/components/ui/Toast";
import BookCard from "@/components/ui/BookCard";
import type { Book } from "@/store/useCartStore";
import type { Dictionary } from "@/dictionaries";

const BookModal = dynamic(() => import("@/components/ui/BookModal"), { ssr: false });

export default function FeaturedBooks({
  books,
  lang,
  dict,
}: {
  books: Book[];
  lang: "ar" | "he";
  dict: Dictionary;
}) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  return (
    <>
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        lang={lang}
        dict={dict}
        onToast={setToastMsg}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {books.map((book, i) => (
          <div key={book.id} className="reveal in-view" style={{ animationDelay: `${i * 80}ms` }}>
            <BookCard book={book} dict={dict.books} onOpen={setSelectedBook} index={i} />
          </div>
        ))}
      </div>
    </>
  );
}
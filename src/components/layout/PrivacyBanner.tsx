"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "secondbook-privacy-accepted";

export default function PrivacyBanner({
  dict,
  lang,
}: {
  dict: { title: string; text: string; accept: string; readMore: string };
  lang: "ar" | "he";
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore storage errors
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 inset-x-0 z-[60] px-4">
      <div
        role="dialog"
        aria-label={dict.title}
        className="max-w-xl mx-auto bg-foreground text-white rounded-2xl shadow-2xl border border-white/10 p-5 fade-up"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 shrink-0 bg-accent/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm mb-1">{dict.title}</p>
            <p className="text-xs text-gray-300 leading-relaxed">{dict.text}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={accept}
            className="flex-1 py-2.5 px-4 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light transition-colors cursor-pointer"
          >
            {dict.accept}
          </button>
          <Link
            href={`/${lang}/privacy`}
            onClick={accept}
            className="flex-1 py-2.5 px-4 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors text-center"
          >
            {dict.readMore}
          </Link>
        </div>
      </div>
    </div>
  );
}
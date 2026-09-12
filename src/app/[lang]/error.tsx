"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useParams<{ lang: string }>();
  const isAr = lang !== "he";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-danger/10 flex items-center justify-center mb-6">
        <svg className="w-9 h-9 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-3">
        {isAr ? "حدث خطأ غير متوقع" : "אירעה שגיאה בלתי צפויה"}
      </h1>
      <p className="text-text-secondary mb-8">
        {isAr ? "نعتذر عن الإزعاج. حاول مرة أخرى." : "מצטערים על אי הנוחות. נסו שוב."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all duration-200 cursor-pointer"
        >
          {isAr ? "إعادة المحاولة" : "נסה שוב"}
        </button>
      </div>
    </div>
  );
}
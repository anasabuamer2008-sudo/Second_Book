"use client";
import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean>(
    () => typeof window !== "undefined" && typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -36px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // Empty deps: mount-only observer (fixes hydration mismatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
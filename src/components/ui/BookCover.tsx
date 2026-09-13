"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface BookCoverProps {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
}

const IMAGE_RE = /\.(png|jpe?g|webp|avif)$/i;

const DEFAULT_SIZES =
  "(min-width: 1280px) 260px, (min-width: 1024px) 300px, (min-width: 640px) 300px, 45vw";

export default function BookCover({
  src,
  alt,
  className = "",
  eager = false,
  sizes = DEFAULT_SIZES,
}: BookCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const valid = src && IMAGE_RE.test(src);

  useEffect(() => {
    if (rootRef.current?.querySelector("img")?.complete) setLoaded(true);
  }, []);

  if (!valid) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary-dark`}
      >
        <span className="text-4xl font-bold text-white/90">{alt.trim().charAt(0) || "K"}</span>
      </div>
    );
  }

  return (
    <div ref={rootRef} className={`relative overflow-hidden bg-surface-alt ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={eager}
        quality={80}
        onLoad={() => setLoaded(true)}
        draggable={false}
        className={`object-cover ${loaded ? "media-loaded" : "media-loading"}`}
      />
    </div>
  );
}
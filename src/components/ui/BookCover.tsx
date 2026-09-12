"use client";
import { useState } from "react";

interface BookCoverProps {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

const IMAGE_RE = /\.(png|jpe?g|webp|avif)$/i;

export default function BookCover({ src, alt, className = "", eager = false }: BookCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const valid = src && IMAGE_RE.test(src);

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
    <div className={`${className} relative bg-surface-alt overflow-hidden`}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover ${loaded ? "media-loaded" : "media-loading"}`}
      />
    </div>
  );
}
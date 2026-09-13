export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items].map((t, i) => (
    <span key={i} className="mx-6 flex items-center gap-6 whitespace-nowrap">
      <span dir="auto">{t}</span>
      <svg className="w-3 h-3 text-accent/70 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </span>
  ));

  return (
    <div
      dir="ltr"
      className="relative overflow-hidden border-y border-primary/15 bg-surface/60 py-3.5 select-none"
      aria-hidden
    >
      <div className="animate-marquee flex w-max">
        <div className="flex shrink-0">{row}</div>
      </div>
    </div>
  );
}
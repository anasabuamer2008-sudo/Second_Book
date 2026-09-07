"use client";

interface Book3DProps {
  title: string;
  theme?: number;
  note?: string;
  noteColor?: string;
  aspect?: "portrait" | "wide";
}

const palettes: [string, string][] = [
  ["#7a4a26", "#512f15"],
  ["#2f5d50", "#1c463b"],
  ["#7a2f2f", "#581f1f"],
  ["#3d4a7a", "#262f52"],
  ["#6b4a8a", "#4b305f"],
  ["#8a6a2f", "#62491d"],
];

export default function Book3D({ title, theme = 0, note, noteColor, aspect = "portrait" }: Book3DProps) {
  const [c1, c2] = palettes[Math.abs(theme) % palettes.length];

  return (
    <div
      className={`book3d ${aspect === "wide" ? "aspect-[4/3]" : "aspect-[3/4]"}`}
      style={{ "--b1": c1, "--b2": c2, "--note-color": noteColor || "#6b4226" } as React.CSSProperties}
    >
      <div className="book3d-body">
        <div className="book3d-pages" />
        <div className="book3d-cover">
          <svg className="w-10 h-10 opacity-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 4H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zM4 18V6h7v12H4zm9 0V6h7v12h-7zM6 8h3v2H6V8zm0 4h3v2H6v-2zm0 4h3v2H6v-2zm5-8h4v2h-4V8zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z" />
          </svg>
          <span className="font-bold leading-tight text-sm md:text-base line-clamp-4 px-2">
            {title}
          </span>
          {note && <span className="book3d-note">{note}</span>}
        </div>
      </div>
    </div>
  );
}
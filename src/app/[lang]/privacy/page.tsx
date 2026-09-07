import { getDictionary } from "@/dictionaries";
import Link from "next/link";

const ICONS: Record<string, string> = {
  identity: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1v7z",
  data: "M4 7v10c0 2 1.5 3 4 3s4-1 4-3V7c0-2-1.5-3-4-3S4 5 4 7zm12 0v10c0 2 1.5 3 4 3s4-1 4-3V7c0-2-1.5-3-4-3s-4 1-4 3z",
  storage: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  use: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  sharing: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  rights: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 8a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17h3.839m.883-2l-.371 1.484a1.088 1.088 0 01-.946.764M12 11v2",
  security: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  compliance: "M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.915a2 2 0 00-1.272 1.272L12 21l-1.912-5.813a2 2 0 00-1.272-1.272L3 12l5.816-1.915a2 2 0 001.272-1.272L12 3z",
  bookstore: "M2 5l6-2v14l-6 2V5zm6 0l6-2v14l-6 2V5zm6 0l4-1v13l-4 1V5zm-3 7h-1v-4h1v4z",
};

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const p = dict.privacy;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent/15 text-foreground font-semibold rounded-full px-5 py-2 mb-4 border border-accent/30">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          {typedLang === "ar" ? "الأمان والثقة" : "אבטחה ואמון"}
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">{p.title}</h1>
        <p className="text-text-secondary text-lg">{p.subtitle}</p>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-6" />
        <p className="text-xs text-text-secondary mt-3">{p.updated}</p>
        <p className="text-sm font-semibold text-primary mt-3">{p.motto}</p>
      </header>

      <nav aria-label={p.toc} className="mb-10 bg-surface rounded-2xl border border-border p-6 md:p-8 no-print">
        <h2 className="text-lg font-bold text-foreground mb-4">{p.toc}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {p.groups.map((g) => (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-6 mb-8">
        {p.groups.map((g) => (
          <section
            key={g.id}
            id={g.id}
            className="scroll-mt-28 bg-surface rounded-2xl border border-border p-6 md:p-8"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ICONS[g.id]} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">{g.title}</h2>
            </div>
            <dl className="space-y-4">
              {g.items.map((item) => (
                <div key={item.h}>
                  <dt className="font-semibold text-foreground mb-1">{item.h}</dt>
                  <dd className="text-text-secondary leading-relaxed">{item.p}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">{p.contactHeader}</h2>
        </div>
        <p className="text-white/85 mb-5">{p.contactText}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`mailto:${p.email}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {p.email}
          </a>
          <Link
            href={`/${typedLang}/books`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/15 text-white font-bold rounded-xl hover:bg-white/25 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {p.backShop}
          </Link>
        </div>
      </div>
    </main>
  );
}
import { getDictionary } from "@/dictionaries";

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const p = dict.privacy;

  const sections = [
    {
      icon: "M4 7v10c0 2 1.5 3 4 3s4-1 4-3V7c0-2-1.5-3-4-3S4 5 4 7zm12 0v10c0 2 1.5 3 4 3s4-1 4-3V7c0-2-1.5-3-4-3s-4 1-4 3z",
      title: p.dataHeader,
      text: p.dataText,
    },
    {
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      title: p.storageHeader,
      text: p.storageText,
    },
    {
      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: p.usageHeader,
      text: p.usageText,
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: p.cookiesHeader,
      text: p.cookiesText,
    },
    {
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: p.rightsHeader,
      text: p.rightsText,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-accent/15 text-foreground font-semibold rounded-full px-5 py-2 mb-4 border border-accent/30">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
          </svg>
          {typedLang === "ar" ? "الأمان والثقة" : "בטחון ואמון"}
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">{p.title}</h1>
        <p className="text-text-secondary text-lg">{p.subtitle}</p>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-6" />
        <p className="text-xs text-text-secondary mt-3">{p.updated}</p>
      </div>

      <div className="space-y-6 mb-8">
        {sections.map((s) => (
          <div key={s.title} className="bg-surface rounded-2xl border border-border p-6 md:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground">{s.title}</h2>
            </div>
            <p className="text-text-secondary leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">{p.contactHeader}</h2>
        </div>
        <p className="text-white/80 mb-5">{p.contactText}</p>
        <a
          href={`mailto:${p.email}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors inline-flex items-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {p.email}
        </a>
      </div>
    </div>
  );
}
import { getDictionary } from "@/dictionaries";

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang as "ar" | "he");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-accent/15 text-foreground font-semibold rounded-full px-5 py-2 mb-4 border border-accent/30">
          <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          {dict.about.owner}: <span className="font-bold">{dict.about.ownerName}</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">{dict.about.title}</h1>
        <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
      </div>

      {/* Story Section */}
      <div className="bg-surface rounded-2xl border border-border p-8 md:p-10 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{dict.about.story}</h2>
        </div>
        <p className="text-text-secondary leading-relaxed text-lg">{dict.about.storyText}</p>
      </div>

      {/* Mission Section */}
      <div className="bg-surface rounded-2xl border border-border p-8 md:p-10 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">{dict.about.mission}</h2>
        </div>
        <p className="text-text-secondary leading-relaxed text-lg">{dict.about.missionText}</p>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-br from-primary to-primary-light rounded-2xl p-8 md:p-10 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">{dict.about.contact}</h2>
        </div>
        <p className="text-white/80 mb-6">{dict.about.contactText}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:abdallazeed3@gmail.com"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            abdallazeed3@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

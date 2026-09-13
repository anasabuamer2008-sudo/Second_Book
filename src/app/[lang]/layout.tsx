import { getDictionary } from "@/dictionaries";
import { SITE_URL, SITE_NAME, BRAND_NAME } from "@/lib/config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyBanner from "@/components/layout/PrivacyBanner";
import BackToTop from "@/components/layout/BackToTop";
import {
  Amiri,
  Cairo,
  Frank_Ruhl_Libre,
  Heebo,
} from "next/font/google";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-display-ar",
  display: "swap",
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  variable: "--font-display-he",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-sans-ar",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-sans-he",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "he" }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const base = SITE_URL;
  return {
    metadataBase: new URL(base),
    title: {
      default: `${BRAND_NAME[typedLang]} | ${SITE_NAME}`,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.meta.description,
    alternates: {
      languages: { ar: `${base}/ar`, he: `${base}/he` },
      canonical: `${base}/${typedLang}`,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: typedLang === "ar" ? "ar_AR" : "he_IL",
      altLocale: typedLang === "ar" ? "he_IL" : "ar_AR",
      type: "website",
      siteName: SITE_NAME,
      images: [
        {
          url: `${base}/icon.jpg`,
          width: 512,
          height: 512,
          alt: `${SITE_NAME} Logo`,
        },
      ],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const fonts =
    typedLang === "ar"
      ? `${cairo.variable} ${amiri.variable}`
      : `${heebo.variable} ${frankRuhl.variable}`;

  const themeInit = `(function(){try{var t=localStorage.getItem("secondbook-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

  return (
    <html lang={typedLang} dir="rtl" suppressHydrationWarning className={`${fonts} h-full`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <meta name="theme-color" content="#faf8f4" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#16130e" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:right-4 focus:z-[200] focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:rounded-xl focus:font-bold focus:shadow-lg"
        >
          {typedLang === "ar" ? "تخطَّ إلى المحتوى" : "דלג לתוכן"}
        </a>
        <Navbar lang={typedLang} dict={dict} />
        <main id="main-content" className="flex-1 pb-16 md:pb-0">
          {children}
        </main>
        <Footer lang={typedLang} dict={dict} />
        <PrivacyBanner dict={dict.privacyBanner} lang={typedLang} />
        <BackToTop label={typedLang === "ar" ? "العودة للأعلى" : "חזרה לראש הדף"} />
      </body>
    </html>
  );
}
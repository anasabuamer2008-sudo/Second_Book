import { getDictionary } from "@/dictionaries";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyBanner from "@/components/layout/PrivacyBanner";
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
  weight: ["400", "500", "700"],
  variable: "--font-display-he",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sans-ar",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-sans-he",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "he" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const typedLang = lang === "he" ? "he" : "ar";
  const dict = getDictionary(typedLang);
  const base = "https://second-book.example.com";
  return {
    title: dict.meta.title,
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
      images: [
        {
          url: `${base}/logo.jpg`,
          width: 512,
          height: 512,
          alt: "Second Book Logo",
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
  const fonts = `${cairo.variable} ${heebo.variable} ${amiri.variable} ${frankRuhl.variable}`;

  return (
    <html lang={typedLang} dir="rtl" className={`${fonts} h-full`}>
      <body className="min-h-full flex flex-col">
        <Navbar lang={typedLang} dict={dict} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer lang={typedLang} dict={dict} />
        <PrivacyBanner dict={dict.privacyBanner} lang={typedLang} />
      </body>
    </html>
  );
}
import Link from "next/link";

interface FooterProps {
  lang: "ar" | "he";
  dict: {
    footer: {
      description: string;
      quickLinks: string;
      rights: string;
      developedBy: string;
      privacy: string;
    };
    nav: {
      home: string;
      buying: string;
      about: string;
      orders: string;
      brand: string;
    };
  };
}

const INSTAGRAM_URL = "https://www.instagram.com/second_book07/";

export default function Footer({ lang, dict }: FooterProps) {
  const isAr = lang === "ar";
  const brandName = isAr ? "الكتاب الثاني" : "הספר השני";

  return (
    <footer className="bg-foreground text-white mt-auto print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpg"
                alt="Second Book Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-accent/40 select-none"
                draggable={false}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-xl font-extrabold tracking-tight">
                  Second Book
                </span>
                <span className="text-[11px] font-semibold text-accent">
                  {brandName}
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{dict.footer.quickLinks}</h3>
            <div className="flex flex-col gap-2">
              <Link href={`/${lang}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dict.nav.home}
              </Link>
              <Link href={`/${lang}/books`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dict.nav.buying}
              </Link>
              <Link href={`/${lang}/about`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dict.nav.about}
              </Link>
              <Link href={`/${lang}/orders`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dict.nav.orders}
              </Link>
              <Link href={`/${lang}/privacy`} className="text-gray-400 hover:text-white transition-colors text-sm">
                {dict.footer.privacy}
              </Link>
            </div>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              {isAr ? "تواصل معنا" : "צרו קשר"}
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>abdallazeed3@gmail.com</span>
              </div>
              <div className="flex gap-4 mt-2">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] flex items-center justify-center transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rights */}
        <div className="border-t border-white/10 mt-8 pt-8 space-y-2 text-center text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} Second Book — {dict.footer.rights} لـ{" "}
            <span className="text-white font-semibold">أنس أبو عامر</span> و{" "}
            <span className="text-white font-semibold">عبدالله زيد</span>
          </p>
          <p>
            © {new Date().getFullYear()} Second Book — כל הזכויות שמורות ל{" "}
            <span className="text-white font-semibold">אנס אבו עאמר</span> ו{" "}
            <span className="text-white font-semibold">עבדאללה זייד</span>
          </p>
          <p className="text-gray-500 pt-2">
            {dict.footer.developedBy}{" "}
            <a
              href="https://github.com/AbdullahZaid-ggg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-white font-semibold transition-colors"
            >
              @AbdullahZaid-ggg
            </a>
          </p>
          <p className="text-xs text-gray-600 italic">
            Second Book
          </p>
        </div>
      </div>
    </footer>
  );
}
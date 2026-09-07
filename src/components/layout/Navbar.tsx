"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import CartIcon from "./CartIcon";

interface NavbarProps {
  lang: "ar" | "he";
  dict: {
    nav: {
      home: string;
      buying: string;
      about: string;
      cart: string;
      orders: string;
      brand: string;
    };
  };
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const pathname = usePathname();
  const isAr = lang === "ar";
  const brandName = isAr ? "الكتاب الثاني" : "הספר השני";

  const links = [
    { href: `/${lang}`, label: dict.nav.home, icon: "home" },
    { href: `/${lang}/books`, label: dict.nav.buying, icon: "buy" },
    { href: `/${lang}/about`, label: dict.nav.about, icon: "about" },
    { href: `/${lang}/orders`, label: dict.nav.orders, icon: "orders" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt="Second Book Logo"
              width={48}
              height={48}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/30 group-hover:ring-primary transition-all select-none"
              draggable={false}
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                Second Book
              </span>
              <span className="text-[11px] font-semibold text-primary">
                {brandName}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:text-foreground hover:bg-surface-alt"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <CartIcon lang={lang} />
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : "text-text-secondary"
                }`}
              >
                <NavIcon name={link.icon} active={isActive} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "text-primary" : "text-text-secondary";
  switch (name) {
    case "home":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "about":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "orders":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    case "buy":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    default:
      return null;
  }
}
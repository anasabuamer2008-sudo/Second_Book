"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import dynamic from "next/dynamic";
import { useCartStore } from "@/store/useCartStore";

const CartDrawer = dynamic(() => import("@/components/ui/CartDrawer"), { ssr: false });

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
    wishlist: {
      title: string;
    };
    cart: {
      title: string;
      empty: string;
      emptyDescription: string;
      browseBooks: string;
      total: string;
      checkout: string;
      remove: string;
      items: string;
      item: string;
      continueShopping: string;
      freeShippingLabel: string;
      freeShippingRemaining: string;
      freeShippingRemainingEnd: string;
      freeShippingUnlocked: string;
    };
    checkout: {
      deliveryFee: string;
      free: string;
    };
    orders: {
      deliveryMethod: string;
      pickupMethod: string;
    };
  };
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const pathname = usePathname();
  const isAr = lang === "ar";
  const brandName = isAr ? "الكتاب الثاني" : "הספר الثاني";
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useCartStore((s) => s.cart.length);
  const wishlistCount = useCartStore((s) => s.wishlist.length);

  const links = [
    { href: `/${lang}`, label: dict.nav.home, icon: "home" },
    { href: `/${lang}/books`, label: dict.nav.buying, icon: "buy" },
    { href: `/${lang}/wishlist`, label: dict.wishlist.title, icon: "wishlist" },
    { href: `/${lang}/orders`, label: dict.nav.orders, icon: "orders" },
    { href: `/${lang}/about`, label: dict.nav.about, icon: "about" },
  ];

  const openDrawer = () => setDrawerOpen(true);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link
              href={`/${lang}`}
              className="group flex items-center gap-3 rounded-xl focus-visible:outline-primary"
            >
              <Image
                src="/logo.jpg"
                alt="Second Book Logo"
                width={44}
                height={44}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/25 group-hover:ring-primary/60 transition-all select-none"
                draggable={false}
              />
              <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-extrabold tracking-tight text-foreground">
                  Second Book
                </span>
                <span className="text-[11px] font-semibold text-primary">{brandName}</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-text-secondary hover:text-foreground hover:bg-surface-alt"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute inset-x-4 -bottom-[1px] h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={openDrawer}
                aria-label={dict.cart.title}
                className="relative p-2 rounded-xl border border-border bg-surface hover:border-primary/40 hover:bg-surface-alt transition-all duration-200 cursor-pointer"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-primary text-white text-[11px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-background">
                    {count}
                  </span>
                )}
              </button>
              <LanguageSwitcher currentLang={lang} />
            </div>
          </div>
        </div>

        {/* Cart drawer */}
        <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} dict={dict} lang={lang} />

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur-xl border-t border-border z-50"
          aria-label="Mobile"
        >
          <div className="flex items-center justify-around h-16 px-2 safe-area-b">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
                    isActive ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  <NavIcon name={link.icon} active={isActive} />
                  {link.icon === "wishlist" && wishlistCount > 0 && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 min-w-4 h-4 px-1 bg-danger text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-background">
                      {wishlistCount}
                    </span>
                  )}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const color = active ? "text-primary" : "text-text-secondary";
  switch (name) {
    case "home":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "about":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M5 6l7-4 7 4M4 10h16v11H4V10z" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "wishlist":
      return (
        <svg className={`w-5 h-5 ${color}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    default:
      return null;
  }
}
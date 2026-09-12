import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const defaultLocale = "ar";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow known locale paths
  if (
    pathname.startsWith("/ar/") ||
    pathname === "/ar" ||
    pathname.startsWith("/he/") ||
    pathname === "/he"
  ) {
    return;
  }

  // Skip static files, API routes and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Unknown first segment (e.g. /fr/...) -> send to default locale
  const firstSegment = pathname.split("/")[1];
  if (firstSegment) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}`;
    return NextResponse.redirect(url);
  }

  // No locale -> redirect based on Accept-Language
  const acceptLang = request.headers.get("accept-language") || "";
  const preferred = acceptLang.includes("he") ? "he" : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
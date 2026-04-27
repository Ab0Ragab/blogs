import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE } from "./lib/constants/auth";
import { i18n } from "./i18n/config";

function getLocale(request: NextRequest): string {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && i18n.locales.includes(cookie as (typeof i18n.locales)[number]))
    return cookie;

  const acceptLang = request.headers.get("accept-language") ?? "";
  const preferred = acceptLang
    .split(",")
    .map((l) => l.split(";")[0].trim().substring(0, 2))
    .find((l) => i18n.locales.includes(l as (typeof i18n.locales)[number]));

  return preferred ?? i18n.defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // i18n: redirect to locale-prefixed path if missing
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Auth: protect /[lang]/blog routes
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const langMatch = pathname.match(/^\/(en|ar)/);
  const lang = langMatch ? langMatch[1] : i18n.defaultLocale;
  const pathWithoutLang = pathname.replace(/^\/(en|ar)/, "");
  const isProtectedRoute = pathWithoutLang.startsWith("/blog");

  if (isProtectedRoute && !authToken) {
    const loginUrl = new URL(`/${lang}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)" ],
};

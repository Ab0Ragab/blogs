import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE } from "./lib/constants/auth";

const protectedRoutes = ["/blog"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const isProtectedRoute = protectedRoutes.includes(path);

  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/blog/:path*"],
};

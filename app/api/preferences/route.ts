import { NextResponse } from "next/server";
import { THEME_COOKIE } from "@/lib/constants/auth";

export async function POST(req: Request) {
  const { theme } = await req.json();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 365 * 86400,
    sameSite: "strict",
  });
  return res;
}

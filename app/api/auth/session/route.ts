import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_TOKEN_COOKIE } from "@/lib/constants/auth";

const COOKIE = AUTH_TOKEN_COOKIE;
const MAX_AGE = 7 * 86400;
const OPTS = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };

export async function POST(req: Request) {
  const { token } = await req.json();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, { ...OPTS, maxAge: MAX_AGE });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", { ...OPTS, maxAge: 0 });
  return res;
}

export async function GET() {
  const store = await cookies();
  return NextResponse.json({ authenticated: !!store.get(COOKIE)?.value });
}

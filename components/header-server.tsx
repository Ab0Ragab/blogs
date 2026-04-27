import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/lib/constants/auth";
import type { Locale } from "@/i18n/config";
import Header from "./header";

export default async function HeaderServer({ lang }: { lang: Locale }) {
  const store = await cookies();
  const dark = store.get(THEME_COOKIE)?.value === "dark";
  return <Header initialDark={dark} lang={lang} />;
}

import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/lib/constants/auth";
import Header from "./header";

export default async function HeaderServer() {
  const store = await cookies();
  const dark = store.get(THEME_COOKIE)?.value === "dark";
  return <Header initialDark={dark} />;
}

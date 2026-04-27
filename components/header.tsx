"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/i18n/context";
import type { Locale } from "@/i18n/config";

export default function Header({ initialDark = false, lang }: { initialDark?: boolean; lang: Locale }) {
  const { authenticated, email, logout, ready } = useAuth();
  const { dict } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [dark, setDark] = useState(initialDark);

  const toggleTheme = useCallback(async () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: next ? "dark" : "light" }),
    });
    router.refresh();
  }, [dark, router]);

  const switchLocale = (newLang: Locale) => {
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000`;
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    router.push(newPath);
  };

  function handleLogout() {
    logout();
    router.push(`/${lang}`);
  }

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
        <Link
          href={`/${lang}`}
          className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          {dict.header.brand}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href={`/${lang}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {dict.header.home}
          </Link>
          <Link href={`/${lang}/blog`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {dict.header.blog}
          </Link>
          <button
            onClick={() => switchLocale(lang === "en" ? "ar" : "en")}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center text-xs font-bold"
            aria-label="Switch language"
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
            aria-label={dict.header.toggleDark}
          >
            {dark ? "☀️" : "🌙"}
          </button>
          {ready && (authenticated ? (
            <>
              <span>{email}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
              >
                {dict.header.logout}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${lang}/login`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                {dict.header.login}
              </Link>
              <Link
                href={`/${lang}/signup`}
                className="rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-white hover:brightness-110 transition-all"
              >
                {dict.header.signup}
              </Link>
            </>
          ))}
        </nav>
      </div>
    </header>
  );
}

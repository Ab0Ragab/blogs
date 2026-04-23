"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Header({ initialDark = false }: { initialDark?: boolean }) {
  const { authenticated, email, logout } = useAuth();
  const router = useRouter();
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

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Our Blog
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Home
          </Link>
          <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Blog
          </Link>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer w-8 h-8 flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>
          {authenticated ? (
            <>
              <span>{email}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-white hover:brightness-110 transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

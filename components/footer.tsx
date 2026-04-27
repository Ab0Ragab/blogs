"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";

export default function Footer({ lang }: { lang: string }) {
  const [year] = useState(() => new Date().getFullYear());
  const { dict } = useI18n();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-4xl px-6 py-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>{dict.footer.copyright.replace("{year}", String(year))}</p>
        <nav className="flex gap-4">
          <Link
            href={`/${lang}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {dict.footer.home}
          </Link>
          <Link
            href={`/${lang}/blog`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {dict.footer.blog}
          </Link>
        </nav>
      </div>
    </footer>
  );
}

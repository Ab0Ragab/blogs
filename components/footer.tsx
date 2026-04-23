"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [year] = useState(() => new Date().getFullYear());

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="mx-auto max-w-4xl px-6 py-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {year} Our Blog</p>
        <nav className="flex gap-4">
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Blog
          </Link>
        </nav>
      </div>
    </footer>
  );
}

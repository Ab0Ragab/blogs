"use client";

import { Suspense, useDeferredValue, useEffect, useState } from "react";
import useFilterNav from "@/lib/use-filter-nav";
import { useI18n } from "@/i18n/context";

export default function BlogFilters() {
  return (
    <Suspense>
      <Filters />
    </Suspense>
  );
}

const inputClass =
  "rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

function Filters() {
  const { searchParams, isPending, navigate, clear } = useFilterNav();
  const { dict } = useI18n();

  const search = searchParams.get("search") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const [query, setQuery] = useState(search);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (deferredQuery === search) return;
    navigate({ search: deferredQuery });
  }, [deferredQuery, search, navigate]);

  const hasFilters = search || dateFrom || dateTo;

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder={dict.blog.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`flex-1 min-w-50 ${inputClass} placeholder:text-slate-400`}
        />
        <input type="date" value={dateFrom} onChange={(e) => navigate({ from: e.target.value })} className={inputClass} />
        <input type="date" value={dateTo} onChange={(e) => navigate({ to: e.target.value })} className={inputClass} />
        {hasFilters && (
          <button
            onClick={() => { setQuery(""); clear(); }}
            className={`${inputClass} cursor-pointer text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-500 transition-colors`}
          >
            {dict.blog.clear}
          </button>
        )}
      </div>
      {isPending && <LoadingBar />}
    </div>
  );
}

export function LoadingBar() {
  return (
    <div className="absolute left-0 right-0 -bottom-3 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div className="h-full w-1/3 rounded-full bg-indigo-500 sliding-bar" />
    </div>
  );
}

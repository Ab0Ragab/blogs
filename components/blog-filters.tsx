"use client";

import { Suspense, useDeferredValue, useEffect, useState } from "react";
import useFilterNav from "@/lib/use-filter-nav";
import { useI18n } from "@/i18n/context";
import { useBlogStore } from "@/lib/blog-store";

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
  const applyFilters = useBlogStore((state) => state.applyFilters);
  const resetFilters = useBlogStore((state) => state.resetFilters);

  const search = searchParams.get("search") ?? "";
  const dateFrom = searchParams.get("from") ?? "";
  const dateTo = searchParams.get("to") ?? "";

  const [query, setQuery] = useState(search);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    applyFilters({ search, from: dateFrom, to: dateTo });
  }, [search, dateFrom, dateTo, applyFilters]);

  useEffect(() => {
    if (deferredQuery === search) return;
    navigate({ search: deferredQuery });
    applyFilters({ search: deferredQuery });
  }, [deferredQuery, search, navigate, applyFilters]);

  const hasFilters = search || dateFrom || dateTo;

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder={dict.blog.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`min-w-50 flex-1 ${inputClass} placeholder:text-slate-400`}
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            navigate({ from: e.target.value });
            applyFilters({ from: e.target.value });
          }}
          className={inputClass}
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            navigate({ to: e.target.value });
            applyFilters({ to: e.target.value });
          }}
          className={inputClass}
        />
        {hasFilters && (
          <button
            onClick={() => {
              setQuery("");
              resetFilters();
              clear();
            }}
            className={`${inputClass} cursor-pointer text-slate-500 transition-colors hover:border-red-300 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400`}
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
    <div className="absolute right-0 -bottom-3 left-0 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div className="sliding-bar h-full w-1/3 rounded-full bg-indigo-500" />
    </div>
  );
}

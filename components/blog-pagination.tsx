"use client";

import { Suspense } from "react";
import useFilterNav from "@/lib/use-filter-nav";
import { LoadingBar } from "@/components/blog-filters";

const POSTS_PER_PAGE = 5;

export default function BlogPagination({ totalPosts }: { totalPosts: number }) {
  return (
    <Suspense>
      <Pagination totalPosts={totalPosts} />
    </Suspense>
  );
}

function Pagination({ totalPosts }: { totalPosts: number }) {
  const { searchParams, isPending, navigate } = useFilterNav();

  const page = Number(searchParams.get("page") ?? "1");
  const totalPages = Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));

  if (totalPages <= 1) return null;

  const btnClass =
    "rounded-lg cursor-pointer disabled:cursor-not-allowed px-3 py-1.5 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors";

  return (
    <div className="relative flex items-center justify-center gap-2 pt-2">
      <button disabled={isPending || page <= 1} onClick={() => navigate({ page: String(page - 1) }, false)} className={btnClass}>
        ← Prev
      </button>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        {page} / {totalPages}
      </span>
      <button disabled={isPending || page >= totalPages} onClick={() => navigate({ page: String(page + 1) }, false)} className={btnClass}>
        Next →
      </button>
      {isPending && <LoadingBar />}
    </div>
  );
}

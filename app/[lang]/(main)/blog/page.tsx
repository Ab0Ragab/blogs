import { Suspense } from "react";
import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import UserPreferences from "@/components/user-preferences";
import BlogFilters from "@/components/blog-filters";
import BlogList from "@/components/blog-list";
import Breadcrumbs from "@/components/breadcrumbs";
import type { BlogFilters as BlogFilterState, BlogPost } from "@/lib/blog-store";

export const metadata: Metadata = { title: "Our Blog" };

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ search?: string; from?: string; to?: string; page?: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 pb-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="mx-auto max-w-4xl px-6 pt-4">
          <BlogFilters />
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
        <Breadcrumbs />

        <Suspense fallback={<Skeleton />}>
          <BlogContent searchParams={searchParams} lang={lang} />
        </Suspense>

        <Suspense fallback={<Skeleton />}>
          <UserPreferences lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}

async function BlogContent({
  searchParams,
  lang,
}: {
  searchParams: Promise<{ search?: string; from?: string; to?: string; page?: string }>;
  lang: Locale;
}) {
  const { search = "", from = "", to = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const initialFilters: BlogFilterState = { search, from, to };

  const res = await fetch(process.env.NEXT_PUBLIC_BLOG_API_URL!);
  const posts: BlogPost[] = await res.json();

  return (
    <BlogList
      initialPosts={posts}
      initialFilters={initialFilters}
      currentPage={currentPage}
      lang={lang}
    />
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-slate-200/60 dark:bg-slate-700/60" />
      ))}
    </div>
  );
}

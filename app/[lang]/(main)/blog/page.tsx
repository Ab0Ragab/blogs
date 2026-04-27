import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import UserPreferences from "@/components/user-preferences";
import BlogFilters from "@/components/blog-filters";
import BlogPagination from "@/components/blog-pagination";
import CopyButton from "@/components/copy-button";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
}

const PER_PAGE = 5;

export const metadata: Metadata = { title: "Our Blog" };

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ search?: string; from?: string; to?: string; page?: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
        <div className="mx-auto max-w-4xl px-6 pt-4">
          <BlogFilters />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8">
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
  const currentPage = Math.max(1, Number(page));
  const dict = await getDictionary(lang);

  const res = await fetch(process.env.NEXT_PUBLIC_BLOG_API_URL!);
  let posts: Post[] = await res.json();

  if (search) {
    const q = search.toLowerCase();
    posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q));
  }
  if (from) posts = posts.filter((p) => p.date >= from);
  if (to) posts = posts.filter((p) => p.date <= to);

  const paginated = posts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{dict.blog.latestPosts}</h2>

      {paginated.length === 0 ? (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">{dict.blog.noPosts}</p>
      ) : (
        <div className="grid gap-4">
          {paginated.map((post, i) => (
            <Link key={post.id} href={`/${lang}/blog/${post.id}`}>
              <article className="group rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <span className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-md">
                    {(currentPage - 1) * PER_PAGE + i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h3>
                      <CopyButton text={post.title} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {dict.blog.by} <span className="font-medium text-slate-700 dark:text-slate-300">{post.author}</span> · {post.date}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <BlogPagination totalPosts={posts.length} />
    </section>
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

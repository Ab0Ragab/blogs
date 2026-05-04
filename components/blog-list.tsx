"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import BlogPagination from "@/components/blog-pagination";
import CopyButton from "@/components/copy-button";
import { filterPosts, type BlogFilters, type BlogPost, useBlogStore } from "@/lib/blog-store";

const PER_PAGE = 5;

type BlogListProps = {
  initialPosts: BlogPost[];
  initialFilters: BlogFilters;
  currentPage: number;
  lang: Locale;
};

export default function BlogList({
  initialPosts,
  initialFilters,
  currentPage,
  lang,
}: BlogListProps) {
  const { dict } = useI18n();
  const posts = useBlogStore((state) => state.posts);
  const postsLoaded = useBlogStore((state) => state.postsLoaded);
  const filters = useBlogStore((state) => state.filters);
  const setPosts = useBlogStore((state) => state.setPosts);
  const applyFilters = useBlogStore((state) => state.applyFilters);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts, setPosts]);

  useEffect(() => {
    applyFilters(initialFilters);
  }, [initialFilters, applyFilters]);

  const effectivePosts = postsLoaded ? posts : initialPosts;
  const effectiveFilters = postsLoaded ? filters : initialFilters;
  const filteredPosts = useMemo(
    () => filterPosts(effectivePosts, effectiveFilters),
    [effectivePosts, effectiveFilters],
  );
  const paginated = filteredPosts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
        {dict.blog.latestPosts}
      </h2>

      {paginated.length === 0 ? (
        <p className="py-8 text-center text-slate-500 dark:text-slate-400">
          {dict.blog.noPosts}
        </p>
      ) : (
        <div className="grid gap-4">
          {paginated.map((post, index) => (
            <Link key={post.id} href={`/${lang}/blog/${post.id}`}>
              <article className="group rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-md">
                    {(currentPage - 1) * PER_PAGE + index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {post.title}
                      </h3>
                      <CopyButton text={post.title} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {dict.blog.by}{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {post.author}
                      </span>{" "}
                      &middot; {post.date}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <BlogPagination totalPosts={filteredPosts.length} />
    </section>
  );
}

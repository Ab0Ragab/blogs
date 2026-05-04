"use client";

import { useEffect } from "react";
import type { Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import Breadcrumbs from "@/components/breadcrumbs";
import { type BlogPost, useBlogStore } from "@/lib/blog-store";

type BlogPostDetailProps = {
  initialPost: BlogPost;
  lang: Locale;
};

export default function BlogPostDetail({ initialPost, lang }: BlogPostDetailProps) {
  const { dict } = useI18n();
  const activePost = useBlogStore((state) => state.activePost);
  const upsertPost = useBlogStore((state) => state.upsertPost);

  useEffect(() => {
    upsertPost(initialPost);
  }, [initialPost, upsertPost]);

  const post = activePost?.id === initialPost.id ? activePost : initialPost;

  return (
    <>
      <Breadcrumbs labels={{ [`/${lang}/blog/${post.id}`]: post.title }} />

      <article className="rounded-2xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80 sm:p-10">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-md">
            {post.author.charAt(0)}
          </span>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {post.author}
            </span>
            <span className="mx-2">&middot;</span>
            {post.date}
          </div>
        </div>

        <h1 className="mb-8 text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
          {post.title}
        </h1>

        <div className="prose prose-slate max-w-none leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-300">
          {post.content || dict.blog.noContent}
        </div>
      </article>
    </>
  );
}

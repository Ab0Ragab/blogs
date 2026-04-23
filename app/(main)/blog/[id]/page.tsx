import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";

interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  content: string;
  description: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  return {
    title: post?.title ?? "Post not found",
    description: post?.description ?? "",
    openGraph: {
      title: post?.title ?? "Post not found",
      description: post?.description ?? "",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post?.title ?? "")}&author=${encodeURIComponent(post?.author ?? "")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mb-8"
        >
          ← Back to all posts
        </Link>

        <Suspense fallback={<PostSkeleton />}>
          <PostContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 p-8 sm:p-10 animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

async function PostContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <article className="rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 p-8 sm:p-10 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold shadow-md">
          {post.author.charAt(0)}
        </span>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {post.author}
          </span>
          <span className="mx-2">·</span>
          {post.date}
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight mb-8">
        {post.title}
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
        {post.content ||
          "This post doesn't have content yet. Check back later!"}
      </div>
    </article>
  );
}

export async function getPost(id: string): Promise<Post | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/${id}`);
  const post: Post = await res.json();
  return post;
}

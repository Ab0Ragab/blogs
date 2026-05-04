import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import BlogPostDetail from "@/components/blog-post-detail";
import type { BlogPost } from "@/lib/blog-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
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
  params: Promise<{ lang: Locale; id: string }>;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Suspense fallback={<PostSkeleton />}>
          <PostContent params={params} />
        </Suspense>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/60 bg-white/80 p-8 animate-pulse dark:border-slate-700/60 dark:bg-slate-800/80 sm:p-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700" />
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

async function PostContent({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang, id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return <BlogPostDetail initialPost={post} lang={lang} />;
}

export async function getPost(id: string): Promise<BlogPost | undefined> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BLOG_API_URL}/${id}`);
  if (!res.ok) return undefined;

  const post: BlogPost = await res.json();
  return post;
}

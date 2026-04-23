import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="text-center space-y-8 px-6">
        <h1 className="text-5xl sm:text-6xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Welcome
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Discover stories, ideas, and insights on our blog.
        </p>
        <Link
          href="/blog"
          className="inline-block rounded-full bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all"
        >
          Go to Blog →
        </Link>
      </div>
    </div>
  );
}

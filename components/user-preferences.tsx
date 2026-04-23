import { cookies } from "next/headers";
import { THEME_COOKIE } from "@/lib/constants/auth";

export default async function UserPreferences() {
  const store = await cookies();
  const theme = store.get(THEME_COOKIE)?.value ?? "light";

  return (
    <aside className="rounded-2xl bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-100 dark:border-indigo-900/50 p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
        Your Preferences
      </h3>
      <div className="flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-300">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-slate-800 px-3 py-1 shadow-sm border border-slate-200 dark:border-slate-700">
          🎨 Theme: <strong>{theme}</strong>
        </span>
      </div>
    </aside>
  );
}

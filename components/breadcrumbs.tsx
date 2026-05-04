"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/context";
import { i18n } from "@/i18n/config";

type BreadcrumbsProps = {
  labels?: Record<string, string>;
};

function prettifySegment(segment: string) {
  return decodeURIComponent(segment)
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Breadcrumbs({ labels = {} }: BreadcrumbsProps) {
  const pathname = usePathname();
  const { dict, lang } = useI18n();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [maybeLocale, ...restSegments] = pathSegments;
  const segments = i18n.locales.includes(maybeLocale as typeof lang)
    ? restSegments
    : pathSegments;

  const routeLabels: Record<string, string> = {
    blog: dict.breadcrumb.blog,
    login: dict.breadcrumb.login,
    signup: dict.breadcrumb.signup,
    offline: dict.breadcrumb.offline,
  };

  const crumbs = [
    {
      href: `/${lang}`,
      label: dict.breadcrumb.home,
    },
    ...segments.map((segment, index) => {
      const href = `/${lang}/${segments.slice(0, index + 1).join("/")}`;
      const parentSegment = segments[index - 1];
      const label =
        labels[href] ??
        labels[segment] ??
        routeLabels[segment] ??
        (parentSegment === "blog" && /^\d+$/.test(segment)
          ? dict.breadcrumb.post.replace("{id}", segment)
          : prettifySegment(segment));

      return { href, label };
    }),
  ];

  return (
    <nav aria-label={dict.breadcrumb.label} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                  /
                </span>
              ) : null}

              {isLast ? (
                <span
                  aria-current="page"
                  className="max-w-56 truncate rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-100 sm:max-w-80"
                  title={crumb.label}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="max-w-44 truncate rounded-md px-2.5 py-1 font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300 sm:max-w-64"
                  title={crumb.label}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

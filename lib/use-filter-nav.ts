"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export default function useFilterNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (params: Record<string, string>, resetPage = true) => {
      const sp = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(params)) {
        if (v) sp.set(k, v);
        else sp.delete(k);
      }
      if (resetPage && !("page" in params)) sp.set("page", "1");
      startTransition(() => router.push(`?${sp.toString()}`));
    },
    [router, searchParams],
  );

  const clear = useCallback(() => {
    startTransition(() => router.push("?"));
  }, [router]);

  return { searchParams, isPending, navigate, clear };
}

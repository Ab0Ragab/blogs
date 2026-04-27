"use client";

import { createContext, useContext } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

type I18nContextValue = { dict: Dictionary; lang: Locale };

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  dict,
  lang,
}: {
  children: React.ReactNode;
  dict: Dictionary;
  lang: Locale;
}) {
  return (
    <I18nContext.Provider value={{ dict, lang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

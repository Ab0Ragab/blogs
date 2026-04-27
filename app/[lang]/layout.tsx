import { Suspense } from "react";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/i18n/context";
import { i18n, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import HeaderServer from "@/components/header-server";
import Footer from "@/components/footer";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;
  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);

  return (
    <div lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="flex-1 flex flex-col">
      <I18nProvider dict={dict} lang={lang}>
        <AuthProvider>
          <Suspense>
            <HeaderServer lang={lang} />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Suspense>
            <Footer lang={lang} />
          </Suspense>
        </AuthProvider>
      </I18nProvider>
    </div>
  );
}

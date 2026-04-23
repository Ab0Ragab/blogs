import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import HeaderServer from "@/components/header-server";
import Footer from "@/components/footer";
import { THEME_COOKIE } from "@/lib/constants/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "Discover stories, ideas, and insights on our blog.",
};

const themeScript = `(function(){var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);if(m&&m[1]==="dark")document.documentElement.classList.add("dark")})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Suspense>
            <HeaderServer />
          </Suspense>
          <main className="flex-1 flex flex-col">{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}

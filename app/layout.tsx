import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Home | Our Blog",
  description: "Discover stories, ideas, and insights on our blog.",
};

const themeScript = `(function(){var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=([^;]*)/);if(m&&m[1]==="dark")document.documentElement.classList.add("dark")})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

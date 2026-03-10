import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "樂閱 Love Reading | 中學生全媒體閱讀平台",
  description: "探索優質文章、收藏喜愛內容、追蹤學習進度，讓閱讀更有趣。",
};

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var theme = localStorage.getItem('theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && prefersDark)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${notoSansTC.variable} font-sans min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 container mx-auto max-w-6xl px-4 py-6 sm:py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

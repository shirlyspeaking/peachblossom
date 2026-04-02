import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "書法字帖生成平台",
  description: "獨立的書法字帖生成網站，支援上傳、預覽與 PDF 下載。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <main className="container mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
      </body>
    </html>
  );
}

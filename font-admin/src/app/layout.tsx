import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "字型健康檢查 | 管理員",
  description: "檢查 lovereading 字型檔與授權標記",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

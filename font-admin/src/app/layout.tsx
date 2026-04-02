import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "字帖生成平台 | 管理員",
  description: "字帖平台維運中心，檢查字型資產與授權狀態",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

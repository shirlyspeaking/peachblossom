import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">書法字帖生成平台</h1>
      <p className="text-slate-600">此網站與 lovereading 完全分離，僅提供字帖生成服務。</p>
      <Link className="text-primary-700 underline" href="/calligraphy">
        前往字帖生成頁
      </Link>
    </div>
  );
}

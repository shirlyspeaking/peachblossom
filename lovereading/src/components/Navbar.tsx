"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search, Compass, Bookmark, TrendingUp, PenTool } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "探索", icon: Compass },
  { href: "/favorites", label: "收藏", icon: Bookmark },
  { href: "/progress", label: "學習進度", icon: TrendingUp },
  { href: "/calligraphy", label: "字帖生成", icon: PenTool },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="container mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"
        >
          <BookOpen className="h-6 w-6 text-primary-500" aria-hidden />
          <span className="hidden sm:inline">樂閱</span>
          <span className="hidden text-slate-500 dark:text-slate-400 sm:inline">
            Love Reading
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder="搜尋文章、主題..."
            className="pl-9"
            aria-label="搜尋文章"
          />
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="主要導覽">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { Search, BookOpen, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
}

export function Navbar({ searchQuery = "", onSearchChange, onSearch }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-card/85 backdrop-blur-md supports-[backdrop-filter]:bg-card/70">
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold tracking-wide text-primary-800 dark:text-primary-200">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <span className="hidden sm:inline-block">悅讀 EnjoyRead</span>
        </Link>

        <nav className="flex flex-1 items-center gap-4">
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜尋文章..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
              />
            </div>
            <Button size="sm" onClick={onSearch}>
              搜尋
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                首頁
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="ghost" size="sm">
                閱讀進度
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="切換深色模式"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}

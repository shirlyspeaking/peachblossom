"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-card/85 backdrop-blur-md supports-[backdrop-filter]:bg-card/70">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <span className="font-serif text-sm font-semibold text-primary-800 dark:text-primary-200">指上飛花</span>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="切換深色模式">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
}

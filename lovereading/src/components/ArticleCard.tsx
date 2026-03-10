"use client";

import { Sparkles } from "lucide-react";
import type { ArticleCard as ArticleCardType } from "@/lib/mock-articles";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sourceStyles: Record<string, string> = {
  "科學人": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
  "BBC 中文": "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300",
  "三聯生活週刊": "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
};

export function ArticleCard({ article }: { article: ArticleCardType }) {
  const sourceClass = sourceStyles[article.source] ?? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <span
          className={cn(
            "inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
            sourceClass
          )}
        >
          {article.source}
        </span>
        <CardTitle className="line-clamp-2 pt-1">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {article.summary}
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full gap-2" size="sm">
          <Sparkles className="h-4 w-4" aria-hidden />
          AI 導讀
        </Button>
      </CardFooter>
    </Card>
  );
}

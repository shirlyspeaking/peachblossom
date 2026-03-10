"use client";

import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article } from "@/lib/mock-data";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const encodedUrl = encodeURIComponent(article.url);
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:border-primary-500/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900/50 dark:text-primary-200">
            {article.source}
          </span>
          {article.category && (
            <span className="text-xs text-muted-foreground">{article.category}</span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight">
          {article.title}
        </h3>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.summary}
        </p>
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>約 {article.readTime} 分鐘</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/article?url=${encodedUrl}&title=${encodedTitle}&id=${article.id}`}
          className="w-full"
        >
          <Button className="w-full" variant="default">
            進入導讀
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

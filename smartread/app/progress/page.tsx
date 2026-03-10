"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReadingProgress } from "@/components/ReadingProgress";
import { getReadingProgress } from "@/lib/storage";

export default function ProgressPage() {
  const progress = useMemo(() => getReadingProgress(), []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center px-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首頁
            </Button>
          </Link>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <ReadingProgress
            readCount={progress.readCount}
            totalQuizzes={progress.totalQuizzes}
            averageScore={progress.averageScore}
          />

          {progress.readArticles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  已閱讀文章
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {progress.readArticles.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/article?url=${encodeURIComponent(a.url)}&title=${encodeURIComponent(a.title)}&id=${a.id}`}
                        className="text-primary-600 hover:underline dark:text-primary-400"
                      >
                        {a.title}
                      </Link>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {new Date(a.readAt).toLocaleDateString("zh-TW")}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

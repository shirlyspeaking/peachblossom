"use client";

import { BookOpen, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ReadingProgressProps {
  readCount: number;
  totalQuizzes: number;
  averageScore: number;
}

export function ReadingProgress({
  readCount,
  totalQuizzes,
  averageScore,
}: ReadingProgressProps) {
  const scorePercent = totalQuizzes > 0 ? averageScore : 0;

  return (
    <Card className="rounded-2xl border-primary-200/50 bg-card/95 shadow-[0_24px_60px_oklch(0.53_0.09_8_/_0.06)] backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-serif text-base text-primary-900 dark:text-primary-100">
          <BookOpen className="h-4 w-4" />
          我的閱讀進度
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold">{readCount}</p>
            <p className="text-xs text-muted-foreground">已閱讀文章</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{totalQuizzes}</p>
            <p className="text-xs text-muted-foreground">完成測驗</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              平均分數
            </span>
            <span className="font-medium">
              {totalQuizzes > 0 ? `${averageScore.toFixed(0)}%` : "—"}
            </span>
          </div>
          <Progress value={scorePercent} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

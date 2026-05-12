import { segmentGraphemes } from "./segment";

export type SessionStats = {
  correctGraphemes: number;
  wrongEvents: number;
};

export function emptySessionStats(): SessionStats {
  return { correctGraphemes: 0, wrongEvents: 0 };
}

export function cpmFromGraphemes(graphemeCount: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  return Math.round((graphemeCount / elapsedMs) * 60_000);
}

/** 正確率：正確字元／（正確＋錯誤次數加權）；此處以「錯誤事件」為分母增量之一。 */
export function accuracyPercent(stats: SessionStats): number {
  const denom = stats.correctGraphemes + stats.wrongEvents;
  if (denom <= 0) return 100;
  return Math.round((stats.correctGraphemes / denom) * 1000) / 10;
}

export function countGraphemes(s: string): number {
  return segmentGraphemes(s).length;
}

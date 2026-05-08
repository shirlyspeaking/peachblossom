import { normalizeText } from "@/lib/calligraphy/schemas";
import type { LayoutCell, LayoutPage, LayoutResult, PageLayoutConfig } from "@/lib/calligraphy/types";

export function toCharacters(text: string): string[] {
  return Array.from(
    normalizeText(text)
      .replace(/\n/g, "")
      .replace(/\s+/g, "")
  );
}

function defaultConfig(config: PageLayoutConfig): PageLayoutConfig {
  if (config.mode === "brush") {
    return { ...config, rows: config.rows || 8, cols: config.cols || 8, fontSize: config.fontSize || 46 };
  }
  return { ...config, rows: config.rows || 12, cols: config.cols || 12, fontSize: config.fontSize || 24 };
}

export function buildLayout(text: string, config: PageLayoutConfig): LayoutResult {
  const cfg = defaultConfig(config);
  const characters = toCharacters(text);
  const charactersForLayout =
    cfg.copybookVariant === "strokeOrderPractice"
      ? characters.flatMap((char, sourceIndex) => ([
          { char, practiceStep: 1 as const, sourceChar: char, sourceIndex },
          { char, practiceStep: 2 as const, sourceChar: char, sourceIndex },
          { char, practiceStep: 3 as const, sourceChar: char, sourceIndex },
          { char: "", practiceStep: 4 as const, sourceChar: char, sourceIndex },
        ]))
      : characters.map((char) => ({ char }));
  const perPage = cfg.rows * cfg.cols;
  const pages: LayoutPage[] = [];

  for (let pageIndex = 0; pageIndex * perPage < charactersForLayout.length; pageIndex += 1) {
    const start = pageIndex * perPage;
    const pageChars = charactersForLayout.slice(start, start + perPage);
    const cells: LayoutCell[] = pageChars.map((entry, idx) => {
      const baseCell = {
        row: Math.floor(idx / cfg.cols),
        col: idx % cfg.cols,
      };
      if (cfg.copybookVariant === "strokeOrderPractice") {
        return {
          char: entry.char,
          ...baseCell,
          practiceStep: entry.practiceStep,
          sourceChar: entry.sourceChar,
        };
      }
      return {
        char: entry.char,
        ...baseCell,
      };
    });
    pages.push({ index: pageIndex, cells });
  }

  if (pages.length === 0) pages.push({ index: 0, cells: [] });

  return { normalizedText: normalizeText(text), characters, pages, config: cfg };
}

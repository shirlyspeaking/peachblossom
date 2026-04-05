import {
  CALLIGRAPHY_MODES,
  COPYBOOK_VARIANTS,
  GRID_TYPES,
  type CalligraphyMode,
  type CopybookVariant,
  type GridType,
  type PageLayoutConfig,
} from "@/lib/calligraphy/types";

type ValidationResult<T> = { ok: true; data: T } | { ok: false; message: string };
type UnknownRecord = Record<string, unknown>;

export function normalizeText(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isObject(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function asInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  return fallback;
}

function asBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function validateLayoutConfig(input: unknown): ValidationResult<PageLayoutConfig> {
  if (!isObject(input)) return { ok: false, message: "layout config 必須是物件" };

  const modeRaw = input.mode;
  const gridTypeRaw = input.gridType;
  const fontId = typeof input.fontId === "string" ? input.fontId : "noto";
  const fontSize = asInt(input.fontSize, 46);
  const rows = asInt(input.rows, 8);
  const cols = asInt(input.cols, 8);
  const showGuideLines = asBool(input.showGuideLines, true);
  const variantRaw = input.copybookVariant;
  const copybookVariant: CopybookVariant = COPYBOOK_VARIANTS.includes(variantRaw as CopybookVariant)
    ? (variantRaw as CopybookVariant)
    : "standard";

  if (!CALLIGRAPHY_MODES.includes(modeRaw as CalligraphyMode)) return { ok: false, message: "mode 僅支援 brush 或 pen" };
  if (!GRID_TYPES.includes(gridTypeRaw as GridType)) return { ok: false, message: "gridType 不合法" };
  if (fontSize < 12 || fontSize > 96) return { ok: false, message: "fontSize 需介於 12-96" };
  if (rows < 4 || rows > 20 || cols < 4 || cols > 20) return { ok: false, message: "rows / cols 需介於 4-20" };

  return {
    ok: true,
    data: {
      mode: modeRaw as CalligraphyMode,
      gridType: gridTypeRaw as GridType,
      fontId,
      fontSize,
      rows,
      cols,
      showGuideLines,
      copybookVariant,
    },
  };
}

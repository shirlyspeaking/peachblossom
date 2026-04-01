export const CALLIGRAPHY_MODES = ["brush", "pen"] as const;
export type CalligraphyMode = (typeof CALLIGRAPHY_MODES)[number];

export const GRID_TYPES = ["tian", "mizi", "jiugong", "lines"] as const;
export type GridType = (typeof GRID_TYPES)[number];

export const INPUT_SOURCE_TYPES = ["text", "file"] as const;
export type InputSourceType = (typeof INPUT_SOURCE_TYPES)[number];

export type FontOption = {
  id: string;
  label: string;
  family: string;
  pdfFontFile: string;
};

export const FONT_OPTIONS: FontOption[] = [
  { id: "noto", label: "思源黑體", family: "Noto Sans TC", pdfFontFile: "NotoSansTC-Regular.ttf" },
  { id: "kai", label: "思源宋體", family: "Noto Serif TC", pdfFontFile: "NotoSerifTC-Regular.otf" },
  { id: "hand", label: "硬筆楷體", family: "Noto Sans TC", pdfFontFile: "NotoSansTC-Regular.ttf" },
];

export type PageLayoutConfig = {
  mode: CalligraphyMode;
  gridType: GridType;
  fontId: string;
  fontSize: number;
  rows: number;
  cols: number;
  showGuideLines: boolean;
};

export type LayoutCell = {
  char: string;
  row: number;
  col: number;
};

export type LayoutPage = {
  index: number;
  cells: LayoutCell[];
};

export type LayoutResult = {
  normalizedText: string;
  characters: string[];
  pages: LayoutPage[];
  config: PageLayoutConfig;
};

export type ParseSuccess = {
  ok: true;
  sourceType: InputSourceType;
  filename?: string;
  text: string;
  normalizedText: string;
  warnings: string[];
};

export type ParseErrorCode =
  | "INVALID_INPUT"
  | "UNSUPPORTED_FILE"
  | "FILE_TOO_LARGE"
  | "OCR_FAILED";

export type ParseFailure = {
  ok: false;
  errorCode: ParseErrorCode;
  message: string;
};

import path from "node:path";
import { access, readFile } from "node:fs/promises";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import { FONT_OPTIONS, type FontOption, type LayoutResult } from "@/lib/calligraphy/types";

export type FontAvailability = {
  availableFontIds: string[];
  missingFontIds: string[];
};

export type PdfBuildResult = {
  buffer: Buffer;
  usedFontId: string;
  fallbackFrom?: string;
};

function getFontPath(font: FontOption): string {
  return path.join(process.cwd(), "public", "fonts", font.pdfFontFile);
}

export async function getFontAvailability(): Promise<FontAvailability> {
  const availableFontIds: string[] = [];
  const missingFontIds: string[] = [];

  for (const font of FONT_OPTIONS) {
    try {
      await access(getFontPath(font));
      availableFontIds.push(font.id);
    } catch {
      missingFontIds.push(font.id);
    }
  }

  return { availableFontIds, missingFontIds };
}

async function resolveFont(fontId: string): Promise<{ bytes: Uint8Array; usedFontId: string; fallbackFrom?: string }> {
  const availability = await getFontAvailability();
  const selectedExists = availability.availableFontIds.includes(fontId);
  const selected = FONT_OPTIONS.find((item) => item.id === fontId) ?? FONT_OPTIONS[0];

  if (selectedExists) {
    return {
      bytes: await readFile(getFontPath(selected)),
      usedFontId: selected.id,
    };
  }

  const fallbackId = availability.availableFontIds[0];
  if (!fallbackId) {
    throw new Error("NO_EMBEDDABLE_CJK_FONT");
  }
  const fallback = FONT_OPTIONS.find((item) => item.id === fallbackId)!;
  return {
    bytes: await readFile(getFontPath(fallback)),
    usedFontId: fallback.id,
    fallbackFrom: selected.id,
  };
}

export async function buildPdfBuffer(layout: LayoutResult): Promise<PdfBuildResult> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const resolved = await resolveFont(layout.config.fontId);
  const cjkFont = await doc.embedFont(resolved.bytes, { subset: true });

  const width = 595.28;
  const height = 841.89;
  const margin = 40;
  const gridW = width - margin * 2;
  const gridH = height - margin * 2;
  const cellW = gridW / layout.config.cols;
  const cellH = gridH / layout.config.rows;

  for (const current of layout.pages) {
    const page = doc.addPage([width, height]);

    for (let c = 0; c <= layout.config.cols; c += 1) {
      const x = margin + c * cellW;
      page.drawLine({
        start: { x, y: margin },
        end: { x, y: height - margin },
        thickness: 0.7,
        color: rgb(0.86, 0.86, 0.86),
      });
    }
    for (let r = 0; r <= layout.config.rows; r += 1) {
      const y = margin + r * cellH;
      page.drawLine({
        start: { x: margin, y },
        end: { x: width - margin, y },
        thickness: 0.7,
        color: rgb(0.86, 0.86, 0.86),
      });
    }

    if (layout.config.showGuideLines && layout.config.gridType !== "lines") {
      for (let r = 0; r < layout.config.rows; r += 1) {
        for (let c = 0; c < layout.config.cols; c += 1) {
          const x = margin + c * cellW;
          const y = margin + r * cellH;
          page.drawLine({
            start: { x, y: y + cellH / 2 },
            end: { x: x + cellW, y: y + cellH / 2 },
            thickness: 0.35,
            color: rgb(0.9, 0.9, 0.9),
          });
          page.drawLine({
            start: { x: x + cellW / 2, y },
            end: { x: x + cellW / 2, y: y + cellH },
            thickness: 0.35,
            color: rgb(0.9, 0.9, 0.9),
          });
        }
      }
    }

    page.drawText(`桃花源字帖 | ${layout.config.mode === "brush" ? "毛筆" : "硬筆"}`, {
      x: margin,
      y: height - 24,
      size: 12,
      font: cjkFont,
      color: rgb(0.36, 0.36, 0.36),
    });

    for (const cell of current.cells) {
      const x = margin + cell.col * cellW;
      const yBottom = height - margin - (cell.row + 1) * cellH;
      const size = Math.min(layout.config.fontSize, cellH * 0.7);
      const textWidth = cjkFont.widthOfTextAtSize(cell.char, size);
      page.drawText(cell.char, {
        x: x + (cellW - textWidth) / 2,
        y: yBottom + (cellH - size) / 2,
        size,
        font: cjkFont,
        color: rgb(0.08, 0.08, 0.08),
      });
    }
  }

  const bytes = await doc.save();
  return {
    buffer: Buffer.from(bytes),
    usedFontId: resolved.usedFontId,
    fallbackFrom: resolved.fallbackFrom,
  };
}

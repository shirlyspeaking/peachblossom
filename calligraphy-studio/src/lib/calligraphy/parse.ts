import { normalizeText } from "@/lib/calligraphy/schemas";
import { extractTextByOcr } from "@/lib/calligraphy/ocr";
import type { ParseFailure, ParseSuccess } from "@/lib/calligraphy/types";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const TEXT_TYPES = new Set(["text/plain"]);
const OCR_TYPES = new Set(["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"]);

function unsupported(message = "僅支援 txt、docx、pdf、png、jpg、jpeg、webp"): ParseFailure {
  return { ok: false, errorCode: "UNSUPPORTED_FILE", message };
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value || "";
}

function normalizeDocxForCopybook(input: string): { text: string; warnings: string[] } {
  const warnings: string[] = [];
  const punctuationMap: Record<string, string> = { ",": "，", ".": "。", ";": "；", ":": "：", "?": "？", "!": "！", "(": "（", ")": "）", "[": "【", "]": "】" };

  const lines = input.replace(/\r\n/g, "\n").split("\n").map((line) => line.trimEnd());
  const merged = lines
    .map((line) => line.replace(/[,\.;:\?!\(\)\[\]]/g, (ch) => {
      warnings.push("已將半形標點轉為全形，提升字帖臨寫一致性。");
      return punctuationMap[ch] ?? ch;
    }))
    .map((line) => line.replace(/[ \t]{2,}/g, " "))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { text: merged, warnings: Array.from(new Set(warnings)) };
}

export async function parseSource(inputText: string | null, file: File | null): Promise<ParseSuccess | ParseFailure> {
  const hasText = Boolean(inputText && inputText.trim());
  if (!file && !hasText) return { ok: false, errorCode: "INVALID_INPUT", message: "請貼上文字或上傳檔案" };

  if (file) {
    if (file.size > MAX_FILE_SIZE) return { ok: false, errorCode: "FILE_TOO_LARGE", message: "檔案不可超過 8MB" };

    let text = "";
    const warnings: string[] = [];

    if (TEXT_TYPES.has(file.type) || file.name.toLowerCase().endsWith(".txt")) {
      text = await file.text();
    } else if (OCR_TYPES.has(file.type) || /\.(pdf|png|jpe?g|webp)$/i.test(file.name)) {
      const ocrResult = await extractTextByOcr(file);
      if (!ocrResult.ok) return { ok: false, errorCode: "OCR_FAILED", message: ocrResult.message || "OCR 解析失敗" };
      text = ocrResult.text || "";
      warnings.push("此內容由 OCR 轉換，建議先檢查錯字。");
    } else if (/\.docx$/i.test(file.name)) {
      try {
        const docxText = await extractDocxText(file);
        const normalized = normalizeDocxForCopybook(docxText);
        text = normalized.text;
        warnings.push(...normalized.warnings);
      } catch {
        return { ok: false, errorCode: "INVALID_INPUT", message: "docx 解析失敗，請確認檔案內容是否正常。" };
      }
    } else {
      return unsupported();
    }

    const normalized = normalizeText(text);
    if (!normalized) return { ok: false, errorCode: "INVALID_INPUT", message: "未讀取到有效文字內容" };

    return { ok: true, sourceType: "file", filename: file.name, text, normalizedText: normalized, warnings };
  }

  const normalized = normalizeText(inputText || "");
  return { ok: true, sourceType: "text", text: inputText || "", normalizedText: normalized, warnings: [] };
}

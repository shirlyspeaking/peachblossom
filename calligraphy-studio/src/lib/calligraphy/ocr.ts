const OCR_SPACE_ENDPOINT = "https://api.ocr.space/parse/image";

type OcrResult = { ok: boolean; text?: string; message?: string };

export async function extractTextByOcr(file: File): Promise<OcrResult> {
  const apiKey = process.env.OCR_SPACE_API_KEY;
  if (!apiKey) {
    return { ok: false, message: "尚未設定 OCR_SPACE_API_KEY，無法啟用 PDF/圖片 OCR。" };
  }

  const body = new FormData();
  body.append("file", file);
  body.append("language", "cht");
  body.append("OCREngine", "2");
  body.append("isOverlayRequired", "false");

  const response = await fetch(OCR_SPACE_ENDPOINT, {
    method: "POST",
    headers: { apikey: apiKey },
    body,
  });
  if (!response.ok) return { ok: false, message: "OCR 服務回應失敗" };

  const payload = (await response.json()) as {
    IsErroredOnProcessing?: boolean;
    ErrorMessage?: string[] | string;
    ParsedResults?: Array<{ ParsedText?: string }>;
  };

  if (payload.IsErroredOnProcessing) {
    const msg = Array.isArray(payload.ErrorMessage) ? payload.ErrorMessage.join(" ") : payload.ErrorMessage || "OCR 失敗";
    return { ok: false, message: msg };
  }

  const text = payload.ParsedResults?.map((item) => item.ParsedText || "").join("\n").trim();
  if (!text) return { ok: false, message: "OCR 未辨識到內容" };
  return { ok: true, text };
}

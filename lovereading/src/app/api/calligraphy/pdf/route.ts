import { validateLayoutConfig } from "@/lib/calligraphy/schemas";
import { buildLayout } from "@/lib/calligraphy/layout";
import { buildPdfBuffer } from "@/lib/calligraphy/pdf";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string; config?: unknown };
  if (!body.text?.trim()) {
    return new Response(JSON.stringify({ ok: false, message: "text 不可為空" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const validation = validateLayoutConfig(body.config);
  if (!validation.ok) {
    return new Response(JSON.stringify({ ok: false, message: validation.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const layout = buildLayout(body.text, validation.data);
  const pageLimit = 30;
  if (layout.pages.length > pageLimit) {
    return new Response(
      JSON.stringify({ ok: false, message: `頁數過多，請控制在 ${pageLimit} 頁以內。` }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let pdfBuffer: Buffer;
  let usedFontId = validation.data.fontId;
  let fallbackFrom: string | undefined;
  try {
    const pdfResult = await buildPdfBuffer(layout);
    pdfBuffer = pdfResult.buffer;
    usedFontId = pdfResult.usedFontId;
    fallbackFrom = pdfResult.fallbackFrom;
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        message:
          "PDF 字型載入失敗。請將可嵌入中文字型放到 public/fonts（例如 NotoSansTC-Regular.ttf、NotoSerifTC-Regular.otf）。",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const filename = `copybook-${Date.now()}.pdf`;

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Calligraphy-Font-Used": usedFontId,
      ...(fallbackFrom ? { "X-Calligraphy-Font-Fallback-From": fallbackFrom } : {}),
    },
  });
}

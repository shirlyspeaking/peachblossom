import { NextRequest, NextResponse } from "next/server";

function coerceMessageText(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (raw == null) return "";
  if (Array.isArray(raw)) {
    return raw
      .map((part) => {
        if (typeof part === "string") return part;
        if (!part || typeof part !== "object") return "";
        const p = part as { type?: string; text?: string };
        if (typeof p.text === "string") return p.text;
        return "";
      })
      .join("")
      .trim();
  }
  return "";
}

function extractAssistantAnswer(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as {
    choices?: Array<{
      finish_reason?: string;
      text?: unknown;
      message?: { role?: string; content?: unknown; reasoning_content?: unknown };
    }>;
  };

  const choice = d.choices?.[0];
  const msg = choice?.message;
  if (msg) {
    const content = coerceMessageText(msg.content).trim();
    const reasoning = coerceMessageText(msg.reasoning_content).trim();
    if (content) return content;
    if (reasoning) return reasoning;
  }

  const legacyText = coerceMessageText(choice?.text).trim();
  if (legacyText) return legacyText;

  if (choice?.finish_reason === "content_filter") {
    return "內容因安全規範被略過。";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { topic?: string; maxChars?: number };
  const topic = typeof body.topic === "string" ? body.topic.trim() : "";
  const maxChars = typeof body.maxChars === "number" && body.maxChars > 80 ? Math.min(body.maxChars, 2500) : 600;

  if (!topic) {
    return NextResponse.json({ error: "請輸入主題", text: "" }, { status: 400 });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: "尚未設定 DEEPSEEK_API_KEY，無法自動生成段落。",
      text: "",
    });
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const system = `你是協助學生練習中文打字的編輯。請依使用者主題寫一段適合「照稿打字」練習的繁體中文正文。
規則：
1. 語氣清楚、中性，適合中學生閱讀。
2. 長度約 ${maxChars} 字以內（以繁體中文字符計，勿超過）。
3. 不要標題、不要條列符號、不要 Markdown、不要註解或前言後語，只輸出連貫段落（可使用句號與逗號）。
4. 內容須與主題相關且事實合理，勿加入與打字無關的系統說明。`;

  try {
    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: `主題：${topic.slice(0, 200)}` },
        ],
        temperature: 0.5,
        max_tokens: Math.min(2000, Math.ceil(maxChars * 1.2)),
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = await res.json();
    const raw = extractAssistantAnswer(data)?.trim() || "";
    const text = raw.replace(/^["「『]|["」』]$/g, "").trim();

    return NextResponse.json({
      text: text || "未取得有效內容，請換個主題再試。",
    });
  } catch (err) {
    console.error("typing generate error:", err);
    return NextResponse.json({
      error: "生成失敗，請稍後再試。",
      text: "",
    });
  }
}

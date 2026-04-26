import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { content, url } = body as { content?: string; url?: string };

  if (!content || typeof content !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid content" },
      { status: 400 }
    );
  }

  const hasAnyProvider =
    Boolean(process.env.DEEPSEEK_API_KEY) ||
    Boolean(process.env.GOOGLE_AI_API_KEY) ||
    Boolean(process.env.OPENAI_API_KEY);

  if (!hasAnyProvider) {
    return NextResponse.json(
      {
        summary: content.slice(0, 400) + (content.length > 400 ? "…" : ""),
        questions: [
          {
            question: "這篇文章的主要主題是什麼？",
            options: ["A. 待補充", "B. 待補充", "C. 待補充", "D. 待補充"],
            correctIndex: 0,
            explanation:
              "請設定 DEEPSEEK_API_KEY、GOOGLE_AI_API_KEY 或 OPENAI_API_KEY 以啟用 AI 摘要與出題。",
          },
        ],
      },
      { status: 200 }
    );
  }

  const systemPrompt = `你是一位中學教育專家。請根據以下文章內容：
1. 撰寫一篇 400 字以內的精華短文，適合中學生閱讀，用詞淺白。
2. 根據短文出 3 題選擇題，每題 4 個選項，標記正確答案索引（0-3），並提供解析。

請以 JSON 格式回傳，格式如下：
{
  "summary": "精華短文內容",
  "questions": [
    {
      "question": "題目",
      "options": ["A. 選項1", "B. 選項2", "C. 選項3", "D. 選項4"],
      "correctIndex": 0,
      "explanation": "解析說明"
    }
  ]
}

只回傳 JSON，不要其他文字。`;

  const providerErrors: string[] = [];
  const providers = [
    process.env.DEEPSEEK_API_KEY ? "deepseek" : null,
    process.env.GOOGLE_AI_API_KEY ? "gemini" : null,
    process.env.OPENAI_API_KEY ? "openai" : null,
  ].filter(Boolean) as Array<"deepseek" | "gemini" | "openai">;

  for (const provider of providers) {
    try {
      const text = await generateWithProvider({
        provider,
        systemPrompt,
        content: content.slice(0, 8000),
      });
      const json = extractJson(text);
      return NextResponse.json({ ...json, provider });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      providerErrors.push(`${provider}: ${message}`);
      console.error(`Summarize error (${provider}):`, err);
    }
  }

  return NextResponse.json(
    {
      summary: content.slice(0, 400) + (content.length > 400 ? "…" : ""),
      questions: [],
      error: providerErrors.join(" | "),
    },
    { status: 200 }
  );
}

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return { summary: "", questions: [] };
  }
  try {
    return JSON.parse(match[0]);
  } catch {
    return { summary: "", questions: [] };
  }
}

async function generateWithProvider({
  provider,
  systemPrompt,
  content,
}: {
  provider: "deepseek" | "gemini" | "openai";
  systemPrompt: string;
  content: string;
}) {
  if (provider === "deepseek") {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) throw new Error("Missing DEEPSEEK_API_KEY");

    const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
    const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

    const res = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `文章內容：\n${content}`,
          },
        ],
        temperature: 0.5,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  }

  if (provider === "gemini") {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) throw new Error("Missing GOOGLE_AI_API_KEY");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: `\n\n文章內容：\n${content}` },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 2048,
          },
        }),
      }
    );
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `文章內容：\n${content}`,
        },
      ],
      temperature: 0.5,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "";
}

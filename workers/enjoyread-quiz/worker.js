/**
 * 悅讀靜態站專用：依文章標題＋摘要呼叫 LLM，產出精華短文與 3 題選擇題。
 * API Key 存放在 Worker Secret：DEEPSEEK_API_KEY
 */

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
};

function corsOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  try {
    const h = new URL(origin).hostname;
    if (
      h === "peachspring.cc" ||
      h === "www.peachspring.cc" ||
      h.endsWith(".pages.dev") ||
      h === "localhost" ||
      h === "127.0.0.1"
    ) {
      return origin || "*";
    }
  } catch (_) {
    /* ignore */
  }
  return "*";
}

function corsHeaders(request, extra) {
  const o = corsOrigin(request);
  const h = new Headers(extra);
  h.set("Access-Control-Allow-Origin", o);
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  h.set("Access-Control-Allow-Headers", "Content-Type");
  h.set("Vary", "Origin");
  return h;
}

async function handleRequest(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(request, {}) });
  }

  if (request.method !== "POST") {
    return jsonErr(request, "Method Not Allowed", 405);
  }

  let body;
  try {
    body = await request.json();
  } catch (_) {
    return jsonErr(request, "Invalid JSON", 400);
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const summary = typeof body.summary === "string" ? body.summary.trim() : "";
  const regenerate = Boolean(body.regenerate);
  const generationId =
    typeof body.generationId === "string" ? body.generationId : String(Date.now());

  if (!summary && !title) {
    return jsonErr(request, "需要提供 title 或 summary", 400);
  }

  const content = [title ? `標題：${title}` : "", summary ? `摘要與要點：\n${summary}` : ""]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 8000);

  if (!env.DEEPSEEK_API_KEY) {
    return jsonErr(
      request,
      "Worker 未設定 DEEPSEEK_API_KEY（請執行：wrangler secret put DEEPSEEK_API_KEY）",
      503
    );
  }

  const quizFocuses = [
    "主旨理解、細節辨識、推論判斷",
    "關鍵詞理解、因果關係、作者觀點",
    "段落重點、資訊整合、延伸思考",
    "事實判讀、概念比較、學習反思",
  ];
  const focusIndex = Math.abs(hashString(generationId)) % quizFocuses.length;
  const quizFocus = quizFocuses[focusIndex];

  const systemPrompt = `你是一位中學教育專家。請根據以下材料（可能僅有新聞標題與短摘要）：
1. 撰寫一篇 400 字以內的精華短文，幫助中學生理解主題，用詞淺白；若資訊不足請合理推展，但不要捏造具體數據或引述。
2. 根據這篇精華短文出 3 題選擇題，每題剛好 4 個選項，標記正確答案索引（0-3），並提供簡短解析。
3. 本次題型焦點：${quizFocus}。
4. ${
    regenerate
      ? `這是重新出題，批次代號：${generationId}。請務必重新設計題幹與選項，避免與常見模板重複。`
      : "首次出題請題目清楚、選項具辨析度。"
  }

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

只回傳 JSON，不要其他文字。questions 必須恰好 3 筆。`;

  try {
    const raw = await chatDeepSeek(env, systemPrompt, content, regenerate);
    const parsed = extractJson(raw);
    const normalized = normalizeQuizPayload(parsed, summary);
    return jsonOk(request, { ...normalized, provider: "deepseek" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return jsonOk(request, {
      summary: summary.slice(0, 400) + (summary.length > 400 ? "…" : ""),
      questions: [],
      error: msg,
    });
  }
}

function jsonErr(request, message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: corsHeaders(request, { "Content-Type": "application/json; charset=utf-8" }),
  });
}

function jsonOk(request, data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: corsHeaders(request, { "Content-Type": "application/json; charset=utf-8" }),
  });
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { summary: "", questions: [] };
  try {
    return JSON.parse(match[0]);
  } catch {
    return { summary: "", questions: [] };
  }
}

function normalizeQuizPayload(parsed, fallbackSummary) {
  const summary =
    typeof parsed.summary === "string" && parsed.summary.trim()
      ? parsed.summary.trim()
      : String(fallbackSummary || "").trim();

  let questions = Array.isArray(parsed.questions) ? parsed.questions : [];
  questions = questions.map(normalizeQuestion).filter(Boolean);
  if (questions.length < 3) {
    return { summary, questions: [], error: "模型回傳題目不足 3 題，請按「重新出題」再試。" };
  }
  return { summary, questions: questions.slice(0, 3) };
}

function normalizeQuestion(q) {
  if (!q || typeof q.question !== "string") return null;
  let options = Array.isArray(q.options) ? q.options.map((o) => String(o || "").trim()) : [];
  while (options.length < 4) options.push(`選項 ${options.length + 1}`);
  options = options.slice(0, 4);
  let correctIndex = Number(q.correctIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) correctIndex = 0;
  const explanation = typeof q.explanation === "string" ? q.explanation.trim() : "";
  return { question: q.question.trim(), options, correctIndex, explanation };
}

async function chatDeepSeek(env, systemPrompt, userContent, regenerate) {
  const baseUrl = (env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = env.DEEPSEEK_MODEL || "deepseek-chat";
  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `材料內容：\n${userContent}` },
      ],
      temperature: regenerate ? 0.9 : 0.55,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`DeepSeek HTTP ${res.status}: ${t.slice(0, 500)}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  if (!text) throw new Error("DeepSeek 回傳為空");
  return text;
}

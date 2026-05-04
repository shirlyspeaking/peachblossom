import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const ALLOWED_VOICES = new Set([
  "zh-CN-XiaoxiaoNeural",
  "zh-CN-XiaoyiNeural",
  "zh-CN-YunxiNeural",
  "zh-CN-YunyangNeural",
]);

export async function POST(request: NextRequest) {
  const { text, voice, speed } = (await request.json()) as {
    text?: string;
    voice?: string;
    speed?: number;
  };

  const cleanText = (text || "").replace(/\s+/g, " ").trim().slice(0, 1000);
  if (!cleanText) {
    return NextResponse.json({ error: "Missing text" }, { status: 400 });
  }

  const selectedVoice = ALLOWED_VOICES.has(voice || "")
    ? voice
    : "zh-CN-XiaoxiaoNeural";
  const rate = Number.isFinite(speed) ? Math.min(2, Math.max(0.5, speed || 1)) : 1;
  const ratePercent = Math.round((rate - 1) * 100);
  const rateText = `${ratePercent >= 0 ? "+" : ""}${ratePercent}%`;
  const apiKey = process.env.FREETTS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "FREETTS_API_KEY is not configured. Falling back to browser speech.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://freetts.org/api/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        text: cleanText,
        voice: selectedVoice,
        rate: rateText,
        pitch: "+0Hz",
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || data?.message || "FreeTTS request failed" },
        { status: 502 }
      );
    }

    const audioUrl =
      data.audio_url ||
      data.audioUrl ||
      data.url ||
      data.download_url ||
      (data.file_id ? `https://freetts.org/api/audio/${data.file_id}` : "");

    if (!audioUrl) {
      return NextResponse.json(
        { error: "FreeTTS did not return an audio URL" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      audioUrl,
      voice: selectedVoice,
      provider: "freetts",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}

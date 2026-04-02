import { NextResponse } from "next/server";
import { validateLayoutConfig } from "@/lib/calligraphy/schemas";
import { buildLayout } from "@/lib/calligraphy/layout";

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string; config?: unknown };
  if (!body.text?.trim()) return NextResponse.json({ ok: false, message: "text 不可為空" }, { status: 400 });

  const validation = validateLayoutConfig(body.config);
  if (!validation.ok) return NextResponse.json({ ok: false, message: validation.message }, { status: 400 });

  const layout = buildLayout(body.text, validation.data);
  return NextResponse.json({ ok: true, layout });
}

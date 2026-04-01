import { NextResponse } from "next/server";
import { parseSource } from "@/lib/calligraphy/parse";

export async function POST(request: Request) {
  const form = await request.formData();
  const text = form.get("text");
  const file = form.get("file");
  const result = await parseSource(typeof text === "string" ? text : null, file instanceof File ? file : null);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}

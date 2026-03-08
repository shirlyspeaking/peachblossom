import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", app: "樂閱 Love Reading" });
}

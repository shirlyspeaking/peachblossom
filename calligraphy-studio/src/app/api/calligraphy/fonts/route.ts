import { NextResponse } from "next/server";
import { FONT_OPTIONS } from "@/lib/calligraphy/types";
import { getFontAvailability } from "@/lib/calligraphy/pdf";

export async function GET() {
  const availability = await getFontAvailability();
  return NextResponse.json({
    ok: true,
    fonts: FONT_OPTIONS.map((font) => ({
      id: font.id,
      label: font.label,
      family: font.family,
      available: availability.availableFontIds.includes(font.id),
    })),
    availableFontIds: availability.availableFontIds,
    missingFontIds: availability.missingFontIds,
  });
}

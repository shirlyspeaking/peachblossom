import path from "node:path";
import { stat, readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

type ManifestFont = {
  id: string;
  displayName: string;
  fileName: string;
  licenseTag: string;
  licenseNote?: string;
  source?: string;
  reviewDate?: string;
};

async function readManifest(targetDir: string): Promise<ManifestFont[]> {
  const manifestPath = path.join(targetDir, "font-manifest.json");
  const content = await readFile(manifestPath, "utf8");
  const parsed = JSON.parse(content) as { fonts?: ManifestFont[] };
  return parsed.fonts || [];
}

export async function GET(request: Request) {
  const adminKey = process.env.FONT_ADMIN_KEY;
  const providedKey = headers().get("x-font-admin-key");
  if (adminKey && providedKey !== adminKey) {
    return NextResponse.json({ ok: false, message: "未授權存取管理 API" }, { status: 401 });
  }

  try {
    const fontDir = path.join(process.cwd(), "..", "calligraphy-studio", "public", "fonts");
    const manifestFonts = await readManifest(fontDir);

    const rows = await Promise.all(
      manifestFonts.map(async (font) => {
        const filePath = path.join(fontDir, font.fileName);
        try {
          const fileStat = await stat(filePath);
          return {
            ...font,
            exists: true,
            lastUpdated: fileStat.mtime.toISOString(),
            licenseReviewStatus: getReviewStatus(font.reviewDate),
          };
        } catch {
          return {
            ...font,
            exists: false,
            lastUpdated: null,
            licenseReviewStatus: getReviewStatus(font.reviewDate),
          };
        }
      })
    );

    const payload = {
      ok: true,
      targetDir: fontDir,
      total: rows.length,
      missing: rows.filter((r) => !r.exists).length,
      reviewExpired: rows.filter((r) => r.licenseReviewStatus === "expired").length,
      reviewDueSoon: rows.filter((r) => r.licenseReviewStatus === "due_soon").length,
      rows,
    };

    const format = new URL(request.url).searchParams.get("format");
    if (format === "csv") {
      const header =
        "id,displayName,fileName,exists,licenseTag,licenseNote,source,reviewDate,licenseReviewStatus,lastUpdated";
      const lines = rows.map((row) =>
        [
          row.id,
          row.displayName,
          row.fileName,
          row.exists ? "true" : "false",
          row.licenseTag,
          row.licenseNote || "",
          row.source || "",
          row.reviewDate || "",
          row.licenseReviewStatus,
          row.lastUpdated || "",
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      );
      const csv = [header, ...lines].join("\n");
      return new Response(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": 'attachment; filename="copybook-platform-report.csv"',
        },
      });
    }

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "無法讀取 calligraphy-studio/public/fonts 或 font-manifest.json",
        error: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 }
    );
  }
}

function getReviewStatus(reviewDate?: string): "unknown" | "ok" | "due_soon" | "expired" {
  if (!reviewDate) return "unknown";
  const target = new Date(reviewDate);
  if (Number.isNaN(target.getTime())) return "unknown";

  const now = new Date();
  const diff = target.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "expired";
  if (days <= 30) return "due_soon";
  return "ok";
}

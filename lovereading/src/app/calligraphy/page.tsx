"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FONT_OPTIONS, type GridType, type PageLayoutConfig } from "@/lib/calligraphy/types";

type PreviewCell = { char: string; row: number; col: number };
type PreviewLayout = { pages: Array<{ index: number; cells: PreviewCell[] }>; config: PageLayoutConfig };

const GRID_OPTIONS: Array<{ value: GridType; label: string }> = [
  { value: "tian", label: "田字格" },
  { value: "mizi", label: "米字格" },
  { value: "jiugong", label: "九宮格" },
  { value: "lines", label: "橫線" },
];

export default function CalligraphyPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [layout, setLayout] = useState<PreviewLayout | null>(null);
  const [availableFontIds, setAvailableFontIds] = useState<string[]>(
    FONT_OPTIONS.map((item) => item.id)
  );
  const [fontCheckMessage, setFontCheckMessage] = useState("");
  const [config, setConfig] = useState<PageLayoutConfig>({
    mode: "brush",
    gridType: "tian",
    fontId: "noto",
    fontSize: 46,
    rows: 8,
    cols: 8,
    showGuideLines: true,
  });

  const activePage = layout?.pages[0];

  const cellStyle = useMemo(() => {
    const font = FONT_OPTIONS.find((item) => item.id === config.fontId);
    return {
      fontFamily: font?.family || "Noto Sans TC",
      fontSize: `${config.fontSize}px`,
    };
  }, [config.fontId, config.fontSize]);

  useEffect(() => {
    async function checkFonts() {
      try {
        const res = await fetch("/api/calligraphy/fonts");
        const payload = (await res.json()) as {
          ok: boolean;
          availableFontIds?: string[];
          missingFontIds?: string[];
        };
        if (!payload.ok) return;
        const available = payload.availableFontIds || [];
        setAvailableFontIds(available);
        if (!available.includes(config.fontId) && available.length > 0) {
          setConfig((prev) => ({ ...prev, fontId: available[0] }));
        }
        if ((payload.missingFontIds || []).length > 0) {
          setFontCheckMessage("部分字型檔缺失，下載 PDF 時會自動套用可用字型。");
        } else {
          setFontCheckMessage("PDF 字型檢查完成，所有候選字型可用。");
        }
      } catch {
        setFontCheckMessage("無法檢查 PDF 字型狀態，請確認伺服器可讀取 /public/fonts。");
      }
    }
    checkFonts();
  }, [config.fontId]);

  async function parseInput() {
    setBusy(true);
    setMessage("");
    try {
      if (!file && !text.trim()) {
        setMessage("請先輸入文字或上傳檔案。");
        return;
      }
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);
      if (text.trim()) formData.append("text", text);
      const res = await fetch("/api/calligraphy/parse", { method: "POST", body: formData });
      const payload = (await res.json()) as { ok: boolean; normalizedText?: string; message?: string; warnings?: string[] };
      if (!payload.ok) {
        setMessage(payload.message || "解析失敗");
        return;
      }
      setText(payload.normalizedText || "");
      setMessage(payload.warnings?.join(" ") || "檔案解析完成。");
    } finally {
      setBusy(false);
    }
  }

  async function generatePreview() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/calligraphy/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, config }),
      });
      const payload = (await res.json()) as { ok: boolean; layout?: PreviewLayout; message?: string };
      if (!payload.ok || !payload.layout) {
        setMessage(payload.message || "預覽產生失敗");
        return;
      }
      setLayout(payload.layout);
      setMessage("字帖預覽已更新。");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPdf() {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch("/api/calligraphy/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, config }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setMessage(data.message || "PDF 下載失敗");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `copybook-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      const usedFontId = res.headers.get("X-Calligraphy-Font-Used");
      const fallbackFrom = res.headers.get("X-Calligraphy-Font-Fallback-From");
      if (fallbackFrom && usedFontId) {
        const fromLabel = FONT_OPTIONS.find((f) => f.id === fallbackFrom)?.label || fallbackFrom;
        const toLabel = FONT_OPTIONS.find((f) => f.id === usedFontId)?.label || usedFontId;
        setMessage(`PDF 已下載，字型已自動降級：${fromLabel} -> ${toLabel}。`);
      } else {
        setMessage("PDF 已開始下載。");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">書法字帖生成</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          支援貼上文字或上傳 txt、docx、pdf、圖片，產生毛筆/硬筆字帖並下載 PDF。
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>素材與設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              className="min-h-36 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-900"
              placeholder="貼上詩歌或文字材料..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="space-y-2">
              <Input
                type="file"
                accept=".txt,.pdf,.png,.jpg,.jpeg,.webp,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                docx 會直接解析文字；PDF/圖片將透過 OCR 解析。PDF 下載需伺服器有可嵌入中文字型檔。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                類型
                <select
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900"
                  value={config.mode}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      mode: e.target.value as "brush" | "pen",
                      rows: e.target.value === "brush" ? 8 : 12,
                      cols: e.target.value === "brush" ? 8 : 12,
                      fontSize: e.target.value === "brush" ? 46 : 24,
                    }))
                  }
                >
                  <option value="brush">毛筆</option>
                  <option value="pen">硬筆</option>
                </select>
              </label>
              <label className="text-sm">
                格線
                <select
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900"
                  value={config.gridType}
                  onChange={(e) => setConfig((prev) => ({ ...prev, gridType: e.target.value as GridType }))}
                >
                  {GRID_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                字型
                <select
                  className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900"
                  value={config.fontId}
                  onChange={(e) => setConfig((prev) => ({ ...prev, fontId: e.target.value }))}
                >
                  {FONT_OPTIONS.map((item) => (
                    <option key={item.id} value={item.id} disabled={!availableFontIds.includes(item.id)}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                字體大小
                <Input
                  type="number"
                  min={12}
                  max={96}
                  value={config.fontSize}
                  onChange={(e) => setConfig((prev) => ({ ...prev, fontSize: Number(e.target.value) }))}
                />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled={busy} variant="secondary" onClick={parseInput}>
                <Upload className="mr-2 h-4 w-4" />
                解析上傳內容
              </Button>
              <Button disabled={busy} onClick={generatePreview}>
                生成預覽
              </Button>
              <Button disabled={busy || !text.trim()} variant="outline" onClick={downloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                下載 PDF
              </Button>
            </div>
            {fontCheckMessage ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">{fontCheckMessage}</p>
            ) : null}
            {message ? <p className="text-sm text-primary-700 dark:text-primary-300">{message}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>字帖預覽（第一頁）</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
              style={{
                gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: config.rows * config.cols }).map((_, idx) => {
                const row = Math.floor(idx / config.cols);
                const col = idx % config.cols;
                const char = activePage?.cells.find((cell) => cell.row === row && cell.col === col)?.char || "";
                return (
                  <div
                    key={`${row}-${col}`}
                    className="relative flex aspect-square items-center justify-center border border-slate-200 text-slate-900 dark:border-slate-700 dark:text-slate-100"
                    style={cellStyle}
                  >
                    {config.showGuideLines && config.gridType !== "lines" ? (
                      <>
                        <span className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-700" />
                        <span className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-700" />
                      </>
                    ) : null}
                    <span>{char}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

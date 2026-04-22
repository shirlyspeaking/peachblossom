"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FONT_OPTIONS, type CopybookVariant, type GridType, type PageLayoutConfig } from "@/lib/calligraphy/types";

type PreviewCell = { char: string; row: number; col: number };
type PreviewLayout = { pages: Array<{ index: number; cells: PreviewCell[] }>; config: PageLayoutConfig };

const GRID_OPTIONS: Array<{ value: GridType; label: string }> = [
  { value: "tian", label: "田字格" },
  { value: "mizi", label: "米字格" },
  { value: "jiugong", label: "九宮格" },
  { value: "lines", label: "橫線" },
];

const COPYBOOK_VARIANT_OPTIONS: Array<{ value: CopybookVariant; label: string }> = [
  { value: "standard", label: "標準（黑字）" },
  { value: "lightTracing", label: "淺色描紅" },
  { value: "strokeOrderPractice", label: "筆順練習（1看2描3臨4寫）" },
];

const SAMPLE_TEXT = `春眠不覺曉，處處聞啼鳥。
夜來風雨聲，花落知多少。`;

export default function CalligraphyPage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [layout, setLayout] = useState<PreviewLayout | null>(null);
  const [availableFontIds, setAvailableFontIds] = useState<string[]>(FONT_OPTIONS.map((item) => item.id));
  const [fontCheckMessage, setFontCheckMessage] = useState("");
  const [config, setConfig] = useState<PageLayoutConfig>({
    mode: "brush",
    gridType: "tian",
    fontId: "noto",
    fontSize: 46,
    rows: 8,
    cols: 8,
    showGuideLines: true,
    copybookVariant: "standard",
  });
  const previewRef = useRef<HTMLDivElement | null>(null);
  const activePage = layout?.pages[0];

  const cellStyle = useMemo(() => {
    const font = FONT_OPTIONS.find((item) => item.id === config.fontId);
    return { fontFamily: font?.family || "Noto Sans TC", fontSize: `${config.fontSize}px` };
  }, [config.fontId, config.fontSize]);

  useEffect(() => {
    async function checkFonts() {
      try {
        const res = await fetch("/api/calligraphy/fonts");
        const payload = (await res.json()) as { ok: boolean; availableFontIds?: string[]; missingFontIds?: string[] };
        if (!payload.ok) return;
        const available = payload.availableFontIds || [];
        setAvailableFontIds(available);
        if (!available.includes(config.fontId) && available.length > 0) setConfig((prev) => ({ ...prev, fontId: available[0] }));
        setFontCheckMessage((payload.missingFontIds || []).length > 0 ? "部分字型檔缺失，下載 PDF 時會自動套用可用字型。" : "PDF 字型檢查完成，所有候選字型可用。");
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
      if (!file && !text.trim()) return setMessage("請先輸入文字或上傳檔案。");
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      if (text.trim()) formData.append("text", text);
      const res = await fetch("/api/calligraphy/parse", { method: "POST", body: formData });
      const payload = (await res.json()) as { ok: boolean; normalizedText?: string; message?: string; warnings?: string[] };
      if (!payload.ok) return setMessage(payload.message || "解析失敗");
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
      if (!payload.ok || !payload.layout) return setMessage(payload.message || "預覽產生失敗");
      setLayout(payload.layout);
      setMessage("字帖預覽已更新。");
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        return setMessage(data.message || "PDF 下載失敗");
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
        <h1 className="font-display text-2xl font-normal tracking-[0.06em] text-primary-900 sm:text-3xl">書法字帖生成平台</h1>
        <p className="mt-2 text-slate-600">流程：上傳文字材料（或貼上）→ 選擇毛筆/硬筆與字型 → 生成預覽 → 下載 PDF。</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>素材與設定</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <textarea className="min-h-36 w-full rounded-xl border border-primary-200/70 bg-white/95 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="貼上詩歌或文字材料..." value={text} onChange={(e) => setText(e.target.value)} />
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => setText(SAMPLE_TEXT)}>一鍵帶入示例文本</Button>
            </div>
            <div className="space-y-2">
              <Input type="file" accept=".txt,.pdf,.png,.jpg,.jpeg,.webp,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <p className="text-xs text-slate-500">docx 會直接解析文字；PDF/圖片將透過 OCR 解析。PDF 下載需伺服器有可嵌入中文字型檔。</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">類型
                <select className="mt-1 h-10 w-full rounded-xl border border-primary-200/70 bg-white/95 px-3" value={config.mode} onChange={(e) => setConfig((prev) => ({ ...prev, mode: e.target.value as "brush" | "pen", rows: e.target.value === "brush" ? 8 : 12, cols: e.target.value === "brush" ? 8 : 12, fontSize: e.target.value === "brush" ? 46 : 24 }))}>
                  <option value="brush">毛筆</option><option value="pen">硬筆</option>
                </select>
              </label>
              <label className="text-sm">格線
                <select className="mt-1 h-10 w-full rounded-xl border border-primary-200/70 bg-white/95 px-3" value={config.gridType} onChange={(e) => setConfig((prev) => ({ ...prev, gridType: e.target.value as GridType }))}>
                  {GRID_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="text-sm">字型
                <select className="mt-1 h-10 w-full rounded-xl border border-primary-200/70 bg-white/95 px-3" value={config.fontId} onChange={(e) => setConfig((prev) => ({ ...prev, fontId: e.target.value }))}>
                  {FONT_OPTIONS.map((item) => <option key={item.id} value={item.id} disabled={!availableFontIds.includes(item.id)}>{item.label}</option>)}
                </select>
              </label>
              <label className="text-sm">字體大小
                <Input type="number" min={12} max={96} value={config.fontSize} onChange={(e) => setConfig((prev) => ({ ...prev, fontSize: Number(e.target.value) }))} />
              </label>
              <label className="text-sm sm:col-span-2">字帖版本
                <select
                  className="mt-1 h-10 w-full rounded-xl border border-primary-200/70 bg-white/95 px-3"
                  value={config.copybookVariant}
                  onChange={(e) => setConfig((prev) => ({ ...prev, copybookVariant: e.target.value as CopybookVariant }))}
                >
                  {COPYBOOK_VARIANT_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled={busy} variant="secondary" onClick={parseInput}><Upload className="mr-2 h-4 w-4" />解析上傳內容</Button>
              <Button disabled={busy} onClick={generatePreview}>生成預覽</Button>
              <Button disabled={busy || !text.trim()} variant="outline" onClick={downloadPdf}><Download className="mr-2 h-4 w-4" />下載 PDF</Button>
            </div>
            {fontCheckMessage ? <p className="text-xs text-slate-500">{fontCheckMessage}</p> : null}
            {message ? <p className="text-sm text-primary-700">{message}</p> : null}
          </CardContent>
        </Card>

        <Card ref={previewRef}>
          <CardHeader><CardTitle>字帖預覽（第一頁）</CardTitle></CardHeader>
          <CardContent>
            {/* 外框單一邊框，左右寬度一致；內格僅用右/下分隔線，避免雙線與欄數變化時外緣粗細不一 */}
            <div
              className="w-full overflow-hidden rounded-xl border-2 border-primary-300/90 bg-white shadow-inner"
              style={{ aspectRatio: `${config.cols} / ${config.rows}` }}
            >
              <div
                className="grid h-full w-full"
                style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: config.rows * config.cols }).map((_, idx) => {
                  const row = Math.floor(idx / config.cols);
                  const col = idx % config.cols;
                  const isLines = config.gridType === "lines";
                  const showInnerVertical = !isLines && col < config.cols - 1;
                  const showInnerHorizontal = row < config.rows - 1;
                  const cellBorder =
                    isLines
                      ? showInnerHorizontal
                        ? "border-b border-slate-300"
                        : ""
                      : [showInnerVertical ? "border-r border-slate-300" : "", showInnerHorizontal ? "border-b border-slate-300" : ""].filter(Boolean).join(" ");
                  const currentCell = activePage?.cells.find((cell) => cell.row === row && cell.col === col);
                  const char = currentCell?.char || "";
                  const step = currentCell?.practiceStep;
                  const charTone =
                    config.copybookVariant === "lightTracing"
                      ? "text-pink-300"
                      : config.copybookVariant === "strokeOrderPractice"
                        ? step === 1
                          ? "text-slate-900"
                          : step === 2
                            ? "text-slate-500"
                            : step === 3
                              ? "text-slate-300"
                              : "text-transparent"
                        : "text-slate-900";
                  const showCenterGuides =
                    config.showGuideLines && !isLines && (config.gridType === "tian" || config.gridType === "mizi" || config.gridType === "jiugong");
                  const showMiziDiagonals = showCenterGuides && config.gridType === "mizi";
                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`relative flex min-h-0 min-w-0 items-center justify-center ${charTone} ${cellBorder}`}
                      style={cellStyle}
                    >
                      {showCenterGuides ? (
                        <>
                          <span className="pointer-events-none absolute left-1/2 top-0 z-0 box-border h-full w-0 -translate-x-1/2 border-l border-dashed border-slate-300" />
                          <span className="pointer-events-none absolute left-0 top-1/2 z-0 box-border h-0 w-full -translate-y-1/2 border-t border-dashed border-slate-300" />
                          {showMiziDiagonals ? (
                            <svg
                              className="pointer-events-none absolute inset-0 z-0 text-slate-300"
                              viewBox="0 0 100 100"
                              preserveAspectRatio="none"
                              aria-hidden
                            >
                              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 3.5" />
                              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1.25" strokeDasharray="4 3.5" />
                            </svg>
                          ) : null}
                        </>
                      ) : null}
                      {config.copybookVariant === "strokeOrderPractice" && step ? (
                        <span className="pointer-events-none absolute left-1 top-1 z-20 rounded bg-primary-100/80 px-1 text-[10px] leading-4 text-primary-800">
                          {step}
                        </span>
                      ) : null}
                      <span className="relative z-10">{char}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {config.copybookVariant === "strokeOrderPractice" ? (
              <p className="mt-2 text-xs text-slate-500">每字依序展開為 4 格：1 看字形、2 描紅、3 臨寫、4 空格默寫。</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

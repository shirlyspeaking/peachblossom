"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { ArrowLeft, Download, ImagePlus, RefreshCcw, Sparkles, Star, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type TabKey = "basic" | "visual" | "upload";
type Era = "vintage" | "modern";
type EnergyType = "fire" | "water" | "electric" | "grass" | "psychic" | "dark";

type Html2CanvasOptions = {
  backgroundColor?: string | null;
  logging?: boolean;
  scale?: number;
  useCORS?: boolean;
};

declare global {
  interface Window {
    html2canvas?: (element: HTMLElement, options?: Html2CanvasOptions) => Promise<HTMLCanvasElement>;
  }
}

const ENERGY_OPTIONS: Array<{ id: EnergyType; symbol: string; swatch: string }> = [
  { id: "fire", symbol: "F", swatch: "from-orange-400 via-red-500 to-rose-500" },
  { id: "water", symbol: "W", swatch: "from-cyan-400 via-sky-500 to-blue-600" },
  { id: "electric", symbol: "L", swatch: "from-yellow-300 via-amber-400 to-orange-500" },
  { id: "grass", symbol: "G", swatch: "from-lime-300 via-emerald-400 to-green-600" },
  { id: "psychic", symbol: "P", swatch: "from-fuchsia-400 via-purple-500 to-violet-700" },
  { id: "dark", symbol: "D", swatch: "from-slate-500 via-slate-700 to-slate-950" },
];

const inputClassName =
  "h-11 rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-100 shadow-inner shadow-black/30 placeholder:text-slate-500 focus-visible:ring-yellow-300/40";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "legendary-card";
}

async function getDominantColor(file: File): Promise<{ rgb: string; text: string }> {
  const src = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("image load failed"));
      img.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas unavailable");
    context.drawImage(image, 0, 0, 48, 48);
    const { data } = context.getImageData(0, 0, 48, 48);
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const rr = data[i];
      const gg = data[i + 1];
      const bb = data[i + 2];
      const sat = Math.max(rr, gg, bb) - Math.min(rr, gg, bb);
      if (sat < 14) continue;
      r += rr;
      g += gg;
      b += bb;
      count += 1;
    }
    if (count === 0) return { rgb: "rgb(71, 85, 105)", text: "#f8fafc" };
    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);
    const luminance = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
    return {
      rgb: `rgb(${avgR}, ${avgG}, ${avgB})`,
      text: luminance > 0.62 ? "#0f172a" : "#f8fafc",
    };
  } finally {
    URL.revokeObjectURL(src);
  }
}

export function LegendaryCardCreator({ titleFontClassName }: { titleFontClassName?: string }) {
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [era, setEra] = useState<Era>("vintage");
  const [name, setName] = useState("Celestial Emberfox");
  const [hp, setHp] = useState("320");
  const [abilityName, setAbilityName] = useState("Astral Burst");
  const [description, setDescription] = useState("Channel prismatic flames. Draw 2 cards and strike 1 target.");
  const [illustrator, setIllustrator] = useState("Shirly Zhang");
  const [setNumber, setSetNumber] = useState("PB-001 / ALT");
  const [shadowless, setShadowless] = useState(false);
  const [vintageFilter, setVintageFilter] = useState(true);
  const [showBack, setShowBack] = useState(false);
  const [energies, setEnergies] = useState<EnergyType[]>(["fire", "electric", "psychic"]);
  const [rarity, setRarity] = useState(3);
  const [artUrl, setArtUrl] = useState<string | null>(null);
  const [artLabel, setArtLabel] = useState("尚未上傳插畫");
  const [status, setStatus] = useState("已啟用黃金分割布局（35/65）。");
  const [headerColor, setHeaderColor] = useState("rgb(51, 65, 85)");
  const [headerText, setHeaderText] = useState("#f8fafc");
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [exportReady, setExportReady] = useState(false);
  const [exporting, setExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (window.html2canvas) {
        setExportReady(true);
        window.clearInterval(timer);
      }
    }, 240);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (artUrl?.startsWith("blob:")) URL.revokeObjectURL(artUrl);
    };
  }, [artUrl]);

  const isModern = era === "modern";
  const cardShellStyle: CSSProperties = isModern
    ? {
        background: "linear-gradient(145deg, rgba(255,255,255,0.35), rgba(148,163,184,0.22), rgba(255,255,255,0.08))",
        boxShadow: "0 40px 120px -52px rgba(56,189,248,0.55)",
      }
    : {
        background:
          "linear-gradient(145deg, #fff8d4 0%, #ffcb05 18%, #b68d2d 42%, #ffe89a 65%, #8d6518 100%)",
        boxShadow: "0 35px 110px -50px rgba(255, 203, 5, 0.7)",
      };

  function toggleEnergy(target: EnergyType) {
    setEnergies((current) => {
      const exists = current.includes(target);
      const next = exists ? current.filter((item) => item !== target) : [...current, target];
      return next.length ? next : [target];
    });
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setArtUrl((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
    setArtLabel(file.name);
    setStatus(`已上傳 ${file.name}，正在匹配標題色。`);
    try {
      const dominant = await getDominantColor(file);
      setHeaderColor(dominant.rgb);
      setHeaderText(dominant.text);
      setStatus("已根據插畫主色調自動更新標題欄。");
    } catch {
      setStatus("插畫已上傳，智能配色未能取得主色。");
    }
  }

  function handleTiltMove(event: React.MouseEvent<HTMLDivElement>) {
    if (showBack) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setPointer({ x: x * 100, y: y * 100 });
    setTilt({ x: (0.5 - y) * 9, y: (x - 0.5) * 12 });
  }

  function resetTilt() {
    setPointer({ x: 50, y: 50 });
    setTilt({ x: 0, y: 0 });
  }

  function resetCard() {
    setEra("vintage");
    setName("Celestial Emberfox");
    setHp("320");
    setAbilityName("Astral Burst");
    setDescription("Channel prismatic flames. Draw 2 cards and strike 1 target.");
    setIllustrator("Shirly Zhang");
    setSetNumber("PB-001 / ALT");
    setShadowless(false);
    setVintageFilter(true);
    setShowBack(false);
    setEnergies(["fire", "electric", "psychic"]);
    setRarity(3);
    setHeaderColor("rgb(51, 65, 85)");
    setHeaderText("#f8fafc");
    setStatus("已還原為預設收藏版樣式。");
  }

  async function exportCard() {
    if (!previewRef.current || !window.html2canvas) return;
    setExporting(true);
    setStatus("正在輸出拍賣展示質感 PNG...");
    try {
      const canvas = await window.html2canvas(previewRef.current, {
        backgroundColor: null,
        logging: false,
        scale: 4,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${slugify(name)}.png`;
      link.click();
      setStatus("PNG 匯出完成。");
    } catch (error) {
      setStatus(error instanceof Error ? `匯出失敗：${error.message}` : "匯出失敗。");
    } finally {
      setExporting(false);
    }
  }

  const transformStyle = useMemo(
    () => ({
      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (showBack ? 180 : 0)}deg)`,
    }),
    [tilt, showBack]
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">Legendary Card Creator</p>
              <h1 className={cn("mt-2 text-3xl font-semibold sm:text-4xl", titleFontClassName)}>收藏級電子卡牌工坊</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-white/15 bg-white/5 text-slate-100 hover:bg-white/10">
                <Link href="/../index.html">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回桃花源
                </Link>
              </Button>
              <Button variant="outline" className="border-white/15 bg-white/5 text-slate-100 hover:bg-white/10" onClick={() => setShowBack((v) => !v)}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                {showBack ? "顯示正面" : "翻到背面"}
              </Button>
              <Button onClick={() => void exportCard()} disabled={exporting || !exportReady} className="bg-[#FFCB05] text-slate-950 hover:bg-yellow-300">
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "匯出中..." : "匯出 PNG"}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[35%_65%]">
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl lg:max-h-[calc(100vh-9.5rem)] lg:overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h2 className={cn("text-xl", titleFontClassName)}>控制區</h2>
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                { key: "basic", label: "基礎" },
                { key: "visual", label: "視覺" },
                { key: "upload", label: "上傳" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm transition",
                    activeTab === tab.key
                      ? "border-yellow-300/60 bg-yellow-400/15 text-yellow-200"
                      : "border-white/10 bg-slate-950/60 text-slate-300 hover:bg-white/10"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4 lg:max-h-[calc(100vh-17rem)] lg:overflow-y-auto lg:pr-1">
              {activeTab === "basic" ? (
                <>
                  <label className="block space-y-2 text-sm">
                    <span>卡牌名稱</span>
                    <Input className={inputClassName} value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                  <label className="block space-y-2 text-sm">
                    <span>HP / Power</span>
                    <Input className={inputClassName} value={hp} onChange={(e) => setHp(e.target.value)} />
                  </label>
                  <label className="block space-y-2 text-sm">
                    <span>能力名稱</span>
                    <Input className={inputClassName} value={abilityName} onChange={(e) => setAbilityName(e.target.value)} />
                  </label>
                  <label className="block space-y-2 text-sm">
                    <span>能力敘述</span>
                    <textarea
                      className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-300/30"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </label>
                  <label className="block space-y-2 text-sm">
                    <span>繪師 / 卡號</span>
                    <div className="grid grid-cols-2 gap-2">
                      <Input className={inputClassName} value={illustrator} onChange={(e) => setIllustrator(e.target.value)} />
                      <Input className={inputClassName} value={setNumber} onChange={(e) => setSetNumber(e.target.value)} />
                    </div>
                  </label>
                </>
              ) : null}

              {activeTab === "visual" ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="mb-2 text-sm text-slate-300">一鍵風格切換</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEra("vintage")}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-sm",
                          era === "vintage" ? "border-yellow-300/70 bg-yellow-400/15 text-yellow-200" : "border-white/10 text-slate-300"
                        )}
                      >
                        復古模式
                      </button>
                      <button
                        type="button"
                        onClick={() => setEra("modern")}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-sm",
                          era === "modern" ? "border-cyan-300/70 bg-cyan-400/10 text-cyan-100" : "border-white/10 text-slate-300"
                        )}
                      >
                        現代模式
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Shadowless</p>
                        <p className="text-xs text-slate-400">關閉插畫邊框陰影</p>
                      </div>
                      <Switch checked={shadowless} onCheckedChange={setShadowless} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Vintage Filter</p>
                        <p className="text-xs text-slate-400">低飽和與紙質感</p>
                      </div>
                      <Switch checked={vintageFilter} onCheckedChange={setVintageFilter} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="mb-2 text-sm text-slate-300">稀有度星級</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRarity(value)}
                          className={cn(
                            "rounded-xl border px-3 py-2",
                            rarity === value ? "border-yellow-300/60 bg-yellow-400/15" : "border-white/10"
                          )}
                        >
                          <div className="flex justify-center gap-1">
                            {Array.from({ length: value }).map((_, index) => (
                              <Star key={index} className="h-4 w-4 fill-[#FFCB05] text-[#FFCB05]" />
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              {activeTab === "upload" ? (
                <>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-between rounded-2xl border border-dashed border-yellow-300/40 bg-yellow-400/10 px-4 py-4"
                  >
                    <div>
                      <p className="font-medium text-white">上傳插畫</p>
                      <p className="text-xs text-slate-300">{artLabel}</p>
                    </div>
                    <ImagePlus className="h-5 w-5 text-yellow-300" />
                  </button>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                    <p className="mb-2 text-sm text-slate-300">能量符號</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ENERGY_OPTIONS.map((energy) => (
                        <button
                          key={energy.id}
                          type="button"
                          onClick={() => toggleEnergy(energy.id)}
                          className={cn(
                            "rounded-xl border px-2 py-2",
                            energies.includes(energy.id) ? "border-white/30 bg-white/10" : "border-white/10 bg-slate-900"
                          )}
                        >
                          <div
                            className={cn(
                              "mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white",
                              energy.swatch
                            )}
                          >
                            {energy.symbol}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              <Button variant="outline" onClick={resetCard} className="w-full border-white/15 bg-white/5 text-slate-100 hover:bg-white/10">
                <Wand2 className="mr-2 h-4 w-4" />
                一鍵重置
              </Button>
            </div>
          </aside>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl lg:p-8">
            <div className="flex h-full flex-col items-center justify-center">
              <div
                ref={previewRef}
                className="w-full max-w-[460px]"
                onMouseMove={handleTiltMove}
                onMouseLeave={resetTilt}
              >
                <div className="relative aspect-[63/88] [perspective:1700px]">
                  <div
                    className="relative h-full w-full transition-transform duration-200 [transform-style:preserve-3d]"
                    style={transformStyle}
                  >
                    <div className="absolute inset-0 [backface-visibility:hidden]">
                      <div className="relative h-full w-full rounded-[1.8rem] p-[6px]" style={cardShellStyle}>
                        <div
                          className="relative h-full w-full overflow-hidden rounded-[1.5rem]"
                          style={{
                            background: artUrl
                              ? `linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.85)), url("${artUrl}") center / cover`
                              : "linear-gradient(140deg, rgba(59,130,246,0.28), rgba(15,23,42,0.96) 50%, rgba(168,85,247,0.44))",
                            filter: era === "vintage" && vintageFilter ? "saturate(0.8) contrast(0.95)" : "none",
                          }}
                        >
                          {!isModern ? (
                            <div
                              className={cn(
                                "absolute inset-x-[6%] top-[13%] h-[44%] overflow-hidden rounded-[1.1rem] border-2",
                                shadowless ? "" : "shadow-[0_22px_38px_-24px_rgba(15,23,42,0.95)]"
                              )}
                              style={{ borderColor: "rgba(255, 234, 176, 0.68)" }}
                            >
                              <div
                                className="absolute inset-0"
                                style={{
                                  background: artUrl
                                    ? `url("${artUrl}") center / cover`
                                    : "linear-gradient(130deg, rgba(255,203,5,0.24), rgba(59,130,246,0.4), rgba(168,85,247,0.46))",
                                }}
                              />
                            </div>
                          ) : null}

                          <div
                            className="absolute left-[5%] right-[5%] top-[4.5%] rounded-xl px-4 py-2"
                            style={{ backgroundColor: headerColor, color: headerText }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className={cn("text-xl font-bold", titleFontClassName)}>{name}</p>
                              <div className="text-right">
                                <p className="text-[10px] uppercase tracking-[0.3em]">HP</p>
                                <p className="text-xl font-black text-red-300">{hp}</p>
                              </div>
                            </div>
                          </div>

                          <div className="pointer-events-none absolute inset-0 opacity-80 mix-blend-screen">
                            <div
                              className="absolute inset-0"
                              style={{
                                background: `
                                  radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.2) 16%, rgba(255,255,255,0) 42%),
                                  linear-gradient(115deg, rgba(255,0,153,0.16) 0%, rgba(255,203,5,0.15) 26%, rgba(0,220,255,0.15) 52%, rgba(119,0,255,0.18) 78%, rgba(255,255,255,0.1) 100%)
                                `,
                              }}
                            />
                          </div>

                          <div className="absolute inset-x-[6%] bottom-[11%] rounded-[1.2rem] border border-white/20 bg-white/10 backdrop-blur-xl">
                            <div className="space-y-3 px-4 py-4">
                              <div className="flex items-start justify-between">
                                <p className={cn("text-lg font-semibold text-white", titleFontClassName)}>{abilityName}</p>
                                <div className="flex gap-2">
                                  {energies.map((energy) => {
                                    const meta = ENERGY_OPTIONS.find((item) => item.id === energy) ?? ENERGY_OPTIONS[0];
                                    return (
                                      <div key={energy} className={cn("flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", meta.swatch)}>
                                        {meta.symbol}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <p className="text-sm leading-6 text-slate-100/92">{description}</p>
                            </div>
                          </div>

                          <div className="absolute bottom-[4.8%] left-[6%] right-[6%] flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-slate-100/80">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: rarity }).map((_, index) => (
                                <Star key={index} className="h-3.5 w-3.5 fill-[#FFCB05] text-[#FFCB05]" />
                              ))}
                            </div>
                            <p className="truncate">Illus. {illustrator}</p>
                            <p>{setNumber}</p>
                          </div>

                          {era === "vintage" ? (
                            <div className="absolute bottom-[7.2%] left-[6.5%] rounded-md border border-[#fcd34d] bg-[#1f2937]/70 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fcd34d]">
                              1st Edition
                            </div>
                          ) : null}

                          {era === "modern" ? (
                            <div
                              className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                              style={{
                                backgroundImage:
                                  "repeating-linear-gradient(120deg, rgba(255,255,255,0.14) 0 1px, transparent 1px 5px), repeating-linear-gradient(0deg, rgba(15,23,42,0.12) 0 1px, transparent 1px 6px)",
                              }}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(96,165,250,0.35),transparent_28%),radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.38),transparent_24%),linear-gradient(135deg,#060d27_0%,#132257_48%,#1b0f3b_100%)]">
                        <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25" />
                        <div className="orbit-ring absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/30" />
                        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 bg-[radial-gradient(circle,rgba(255,203,5,0.95)_0%,rgba(255,203,5,0.72)_38%,rgba(255,255,255,0.2)_39%,rgba(255,255,255,0.05)_60%,transparent_61%)]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mx-auto mt-3 h-8 w-[72%] rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(203,213,225,0.18), rgba(15,23,42,0.02)), radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(15,23,42,0) 72%)",
                    filter: "blur(2px)",
                    transform: "perspective(700px) rotateX(70deg)",
                  }}
                />
              </div>
              <p className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">{status}</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ChangeEvent } from "react";
import { ArrowLeft, Download, ImagePlus, RefreshCcw, Sparkles, Star, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type FrameStyle = "classic-gold" | "holo-silver" | "modern-full-art";
type EnergyType = "fire" | "water" | "electric" | "grass" | "psychic" | "dark";

type CardState = {
  name: string;
  hp: string;
  abilityName: string;
  description: string;
  illustrator: string;
  setNumber: string;
  frameStyle: FrameStyle;
  shadowless: boolean;
  vintage: boolean;
  rarity: 1 | 2 | 3;
  energies: EnergyType[];
};

type Html2CanvasOptions = {
  backgroundColor?: string | null;
  logging?: boolean;
  scale?: number;
  useCORS?: boolean;
};

declare global {
  interface Window {
    html2canvas?: (
      element: HTMLElement,
      options?: Html2CanvasOptions
    ) => Promise<HTMLCanvasElement>;
  }
}

const DEFAULT_CARD: CardState = {
  name: "Celestial Emberfox",
  hp: "320",
  abilityName: "Astral Burst",
  description:
    "Channel prismatic flames across the battlefield. Draw 2 cards, then choose 1 opposing target to take radiant splash damage.",
  illustrator: "Shirly Zhang",
  setNumber: "PB-001 / ALT",
  frameStyle: "classic-gold",
  shadowless: false,
  vintage: false,
  rarity: 3,
  energies: ["fire", "electric", "psychic"],
};

const ENERGY_OPTIONS: Array<{
  id: EnergyType;
  label: string;
  symbol: string;
  swatch: string;
}> = [
  { id: "fire", label: "Fire", symbol: "F", swatch: "from-orange-400 via-red-500 to-rose-500" },
  { id: "water", label: "Water", symbol: "W", swatch: "from-cyan-400 via-sky-500 to-blue-600" },
  { id: "electric", label: "Electric", symbol: "L", swatch: "from-yellow-300 via-amber-400 to-orange-500" },
  { id: "grass", label: "Grass", symbol: "G", swatch: "from-lime-300 via-emerald-400 to-green-600" },
  { id: "psychic", label: "Psychic", symbol: "P", swatch: "from-fuchsia-400 via-purple-500 to-violet-700" },
  { id: "dark", label: "Dark", symbol: "D", swatch: "from-slate-500 via-slate-700 to-slate-950" },
];

const FRAME_OPTIONS: Array<{ id: FrameStyle; label: string; note: string }> = [
  { id: "classic-gold", label: "Classic Gold", note: "Golden trim with a premium vintage glow." },
  { id: "holo-silver", label: "Holo Silver", note: "Cool metallic highlights with foil reflections." },
  { id: "modern-full-art", label: "Modern Full-Art", note: "Full bleed illustration with sleek glass overlays." },
];

const frameStyles: Record<
  FrameStyle,
  {
    shellBackground: string;
    shellShadow: string;
    surfaceBackground: string;
    artStroke: string;
    footerTone: string;
  }
> = {
  "classic-gold": {
    shellBackground:
      "linear-gradient(145deg, #fff8d4 0%, #ffcb05 16%, #b68d2d 38%, #ffe89a 58%, #8d6518 80%, #fff7d0 100%)",
    shellShadow: "0 30px 90px -38px rgba(255, 203, 5, 0.65)",
    surfaceBackground:
      "radial-gradient(circle at top, rgba(255, 252, 214, 0.18), transparent 28%), linear-gradient(180deg, #291707 0%, #171114 55%, #09090b 100%)",
    artStroke: "rgba(255, 236, 179, 0.55)",
    footerTone: "text-amber-100/80",
  },
  "holo-silver": {
    shellBackground:
      "linear-gradient(145deg, #eef5ff 0%, #c7d2df 16%, #ffffff 34%, #a7b4c3 58%, #f6fbff 78%, #98a8ba 100%)",
    shellShadow: "0 32px 95px -40px rgba(148, 163, 184, 0.72)",
    surfaceBackground:
      "radial-gradient(circle at 20% 0%, rgba(196, 244, 255, 0.22), transparent 32%), linear-gradient(180deg, #0f172a 0%, #111827 55%, #050816 100%)",
    artStroke: "rgba(226, 232, 240, 0.55)",
    footerTone: "text-slate-200/80",
  },
  "modern-full-art": {
    shellBackground:
      "linear-gradient(145deg, rgba(248,250,252,0.85) 0%, rgba(148,163,184,0.45) 22%, rgba(255,255,255,0.14) 52%, rgba(71,85,105,0.45) 100%)",
    shellShadow: "0 35px 105px -44px rgba(56, 189, 248, 0.58)",
    surfaceBackground: "linear-gradient(180deg, #020617 0%, #0f172a 45%, #020617 100%)",
    artStroke: "rgba(255, 255, 255, 0.2)",
    footerTone: "text-slate-100/72",
  },
};

const inputClassName =
  "h-11 rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-100 shadow-inner shadow-black/30 placeholder:text-slate-500 focus-visible:ring-yellow-300/40";

const panelClassName =
  "rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.95)] backdrop-blur-xl";

function energyMeta(id: EnergyType) {
  return ENERGY_OPTIONS.find((option) => option.id === id) ?? ENERGY_OPTIONS[0];
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "legendary-card";
}

export function LegendaryCardCreator({ titleFontClassName }: { titleFontClassName?: string }) {
  const [card, setCard] = useState<CardState>(DEFAULT_CARD);
  const [artUrl, setArtUrl] = useState<string | null>(null);
  const [artLabel, setArtLabel] = useState("No art uploaded yet");
  const [showBack, setShowBack] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportReady, setExportReady] = useState(false);
  const [status, setStatus] = useState("調整左側設定即可即時打造你的傳奇卡牌。");
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const frameTheme = useMemo(() => frameStyles[card.frameStyle], [card.frameStyle]);
  const isFullArt = card.frameStyle === "modern-full-art";

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (window.html2canvas) {
        setExportReady(true);
        window.clearInterval(timer);
      }
    }, 250);
    if (window.html2canvas) {
      setExportReady(true);
      window.clearInterval(timer);
    }
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (artUrl?.startsWith("blob:")) URL.revokeObjectURL(artUrl);
    };
  }, [artUrl]);

  function updateField<K extends keyof CardState>(field: K, value: CardState[K]) {
    setCard((current) => ({ ...current, [field]: value }));
  }

  function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setArtUrl((previous) => {
      if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setArtLabel(file.name);
    setStatus(`已載入圖像：${file.name}`);
  }

  function toggleEnergy(id: EnergyType) {
    setCard((current) => {
      const exists = current.energies.includes(id);
      const next = exists ? current.energies.filter((energy) => energy !== id) : [...current.energies, id];
      return { ...current, energies: next.length ? next : [id] };
    });
  }

  function resetCard() {
    setCard(DEFAULT_CARD);
    setArtUrl((previous) => {
      if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
      return null;
    });
    setArtLabel("No art uploaded yet");
    setShowBack(false);
    setPointer({ x: 50, y: 50 });
    setStatus("已重置為預設示範卡。");
  }

  function onPointerMove(event: React.MouseEvent<HTMLDivElement>) {
    if (showBack) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setPointer({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  }

  async function exportCard() {
    if (!previewRef.current || !window.html2canvas) {
      setStatus("html2canvas 尚未載入完成，請稍後再試。");
      return;
    }
    setExporting(true);
    setStatus("正在輸出高畫質 PNG...");
    try {
      const canvas = await window.html2canvas(previewRef.current, {
        backgroundColor: null,
        logging: false,
        scale: 4,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${slugify(card.name)}.png`;
      link.click();
      setStatus("匯出成功。");
    } catch (error) {
      setStatus(error instanceof Error ? `匯出失敗：${error.message}` : "匯出失敗。");
    } finally {
      setExporting(false);
    }
  }

  const shellStyle: CSSProperties = {
    background: frameTheme.shellBackground,
    boxShadow: frameTheme.shellShadow,
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">Legendary Card Creator</p>
              <h1 className={cn("mt-2 text-3xl font-semibold text-white sm:text-5xl", titleFontClassName)}>
                Premium TCG Card Forge
              </h1>
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
        </div>

        <div className="grid gap-8 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <section className={panelClassName}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className={cn("text-2xl text-white", titleFontClassName)}>控制面板</h2>
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <div className="space-y-4">
                <label className="space-y-2 text-sm">
                  <span>名稱</span>
                  <Input className={inputClassName} value={card.name} onChange={(e) => updateField("name", e.target.value)} />
                </label>
                <label className="space-y-2 text-sm">
                  <span>HP / Power</span>
                  <Input className={inputClassName} value={card.hp} onChange={(e) => updateField("hp", e.target.value)} />
                </label>
                <label className="space-y-2 text-sm">
                  <span>能力名稱</span>
                  <Input className={inputClassName} value={card.abilityName} onChange={(e) => updateField("abilityName", e.target.value)} />
                </label>
                <label className="space-y-2 text-sm">
                  <span>描述</span>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-300/30"
                    value={card.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span>繪師</span>
                  <Input className={inputClassName} value={card.illustrator} onChange={(e) => updateField("illustrator", e.target.value)} />
                </label>
                <label className="space-y-2 text-sm">
                  <span>卡號</span>
                  <Input className={inputClassName} value={card.setNumber} onChange={(e) => updateField("setNumber", e.target.value)} />
                </label>
              </div>
            </section>

            <section className={panelClassName}>
              <h3 className={cn("mb-3 text-xl text-white", titleFontClassName)}>外框樣式</h3>
              <div className="space-y-3">
                {FRAME_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => updateField("frameStyle", option.id)}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 text-left transition",
                      card.frameStyle === option.id ? "border-yellow-300/60 bg-yellow-400/10" : "border-white/10 bg-slate-950/60"
                    )}
                  >
                    <p className="font-medium text-white">{option.label}</p>
                    <p className="text-sm text-slate-400">{option.note}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Shadowless</p>
                    <p className="text-sm text-slate-400">去除插圖框陰影</p>
                  </div>
                  <Switch checked={card.shadowless} onCheckedChange={(v) => updateField("shadowless", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">Vintage Filter</p>
                    <p className="text-sm text-slate-400">套用紙質紋理</p>
                  </div>
                  <Switch checked={card.vintage} onCheckedChange={(v) => updateField("vintage", v)} />
                </div>
              </div>
            </section>

            <section className={panelClassName}>
              <h3 className={cn("mb-3 text-xl text-white", titleFontClassName)}>圖像與能量</h3>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 flex w-full items-center justify-between rounded-2xl border border-dashed border-yellow-300/40 bg-yellow-400/10 px-4 py-4"
              >
                <div>
                  <p className="font-medium text-white">上傳插圖</p>
                  <p className="text-sm text-slate-400">{artLabel}</p>
                </div>
                <ImagePlus className="h-5 w-5 text-yellow-300" />
              </button>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ENERGY_OPTIONS.map((energy) => (
                  <button
                    key={energy.id}
                    type="button"
                    onClick={() => toggleEnergy(energy.id)}
                    className={cn(
                      "rounded-2xl border px-3 py-3 text-left",
                      card.energies.includes(energy.id) ? "border-white/30 bg-white/10" : "border-white/10 bg-slate-950/60"
                    )}
                  >
                    <div className={cn("mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-white", energy.swatch)}>
                      {energy.symbol}
                    </div>
                    <p className="text-sm text-white">{energy.label}</p>
                  </button>
                ))}
              </div>
              <Button variant="outline" onClick={resetCard} className="mt-4 w-full border-white/15 bg-white/5 text-slate-100 hover:bg-white/10">
                <Wand2 className="mr-2 h-4 w-4" />
                重置示範卡
              </Button>
            </section>
          </aside>

          <section className={cn(panelClassName, "flex items-center justify-center p-4 sm:p-8")}>
            <div className="w-full max-w-[430px]" ref={previewRef} onMouseMove={onPointerMove} onMouseLeave={() => setPointer({ x: 50, y: 50 })}>
              <div className="relative aspect-[63/88] [perspective:1600px]">
                <div
                  className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
                  style={{ transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  <div className="absolute inset-0 [backface-visibility:hidden]">
                    <div className="relative h-full w-full rounded-[1.8rem] p-[5px]" style={shellStyle}>
                      <div className="relative h-full w-full overflow-hidden rounded-[1.55rem]" style={{ background: frameTheme.surfaceBackground }}>
                        <div className={cn("absolute inset-x-[5%] top-[13.5%]", isFullArt ? "h-[72%]" : "h-[45%]")}>
                          <div
                            className={cn("relative h-full overflow-hidden rounded-[1.15rem] border", card.shadowless ? "" : "shadow-[0_22px_40px_-24px_rgba(15,23,42,0.95)]")}
                            style={{
                              borderColor: frameTheme.artStroke,
                              background: artUrl
                                ? `url("${artUrl}") center / cover no-repeat`
                                : "linear-gradient(135deg, rgba(255,203,5,0.16), rgba(96,165,250,0.24) 55%, rgba(168,85,247,0.34) 100%)",
                            }}
                          >
                            <div
                              className="pointer-events-none absolute inset-0 opacity-90 mix-blend-screen"
                              style={{
                                background: `
                                  radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.28) 14%, rgba(255,255,255,0) 34%),
                                  linear-gradient(120deg, rgba(255,0,153,0.26) 0%, rgba(255,203,5,0.2) 24%, rgba(0,220,255,0.2) 48%, rgba(119,0,255,0.24) 74%, rgba(255,255,255,0.12) 100%)
                                `,
                              }}
                            />
                            <div className="holo-band pointer-events-none absolute -inset-[18%] opacity-65 mix-blend-color-dodge" style={{ background: "linear-gradient(115deg, transparent 18%, rgba(255,255,255,0.5) 36%, rgba(255,203,5,0.25) 45%, transparent 58%)" }} />
                          </div>
                        </div>

                        <div className="absolute left-[6%] right-[6%] top-[5%] flex items-start justify-between">
                          <p className={cn("text-[clamp(1.15rem,2.8vw,1.65rem)] font-extrabold text-white", titleFontClassName)}>{card.name}</p>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/80">HP</p>
                            <p className="text-[clamp(1.15rem,2.8vw,1.75rem)] font-black text-red-400">{card.hp}</p>
                          </div>
                        </div>

                        <div className="absolute bottom-[13%] left-[5%] right-[5%] rounded-[1.25rem] border border-white/20 bg-white/10 backdrop-blur-xl">
                          <div className="space-y-3 px-4 py-4">
                            <div className="flex items-start justify-between">
                              <p className={cn("text-lg font-semibold text-white", titleFontClassName)}>{card.abilityName}</p>
                              <div className="flex gap-2">
                                {card.energies.map((energy) => {
                                  const meta = energyMeta(energy);
                                  return (
                                    <div key={energy} className={cn("flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", meta.swatch)}>
                                      {meta.symbol}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            <p className="text-sm leading-6 text-slate-100/92">{card.description}</p>
                          </div>
                        </div>

                        <div className={cn("absolute bottom-[4.8%] left-[6%] right-[6%] flex items-center justify-between text-[11px] uppercase tracking-[0.28em]", frameTheme.footerTone)}>
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: card.rarity }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-[#FFCB05] text-[#FFCB05]" />
                            ))}
                          </div>
                          <p className="truncate">Illus. {card.illustrator}</p>
                          <p>{card.setNumber}</p>
                        </div>

                        {card.vintage ? (
                          <div
                            className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle at 20% 20%, rgba(255, 248, 220, 0.32) 0%, transparent 28%), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 4px)",
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
                      <div className="absolute inset-x-[14%] top-[11%] text-center">
                        <p className={cn("text-lg font-semibold uppercase tracking-[0.42em] text-slate-100", titleFontClassName)}>Legendary</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-200/70">Classic Blue / Purple Orbit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">{status}</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

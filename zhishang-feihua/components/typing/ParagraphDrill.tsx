"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FileUp, Loader2, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { compareParagraph, graphemesEqual, isStrictGraphemePrefix } from "@/lib/typing/compare";
import { accuracyPercent, countGraphemes, cpmFromGraphemes, emptySessionStats, type SessionStats } from "@/lib/typing/metrics";
import { segmentGraphemes, sliceGraphemes } from "@/lib/typing/segment";

type SearchHit = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
};

const MAX_OPTIONS = [400, 700, 1100] as const;

function normalizeParagraph(text: string, collapseSpace: boolean): string {
  let t = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (collapseSpace) {
    t = t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n");
  }
  return t.trim();
}

export function ParagraphDrill() {
  const [draft, setDraft] = useState("");
  const [expected, setExpected] = useState("");
  const [typed, setTyped] = useState("");
  const [collapseSpace, setCollapseSpace] = useState(true);
  const [maxG, setMaxG] = useState<number>(700);
  const composing = useRef(false);
  const [stats, setStats] = useState<SessionStats>(() => emptySessionStats());
  const startedAt = useRef<number | null>(null);
  const [done, setDone] = useState(false);
  const activeRef = useRef<HTMLSpanElement | null>(null);

  const prevTyped = useRef("");
  const prevHadError = useRef(false);

  const [searchQ, setSearchQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searchNote, setSearchNote] = useState("");

  const [fetchingUrl, setFetchingUrl] = useState<string | null>(null);

  const [genTopic, setGenTopic] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const applyExpected = useCallback(
    (raw: string) => {
      const n = normalizeParagraph(raw, collapseSpace);
      const sliced = sliceGraphemes(n, maxG);
      setExpected(sliced);
      setTyped("");
      setDone(false);
      setStats(emptySessionStats());
      startedAt.current = null;
      prevTyped.current = "";
      prevHadError.current = false;
    },
    [collapseSpace, maxG]
  );

  const cmp = useMemo(() => compareParagraph(expected, typed), [expected, typed]);

  useEffect(() => {
    if (expected && graphemesEqual(expected, typed)) {
      setDone(true);
    } else {
      setDone(false);
    }
  }, [expected, typed]);

  useEffect(() => {
    const el = activeRef.current;
    if (el) el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [cmp.matchLen, cmp.hasError, typed, expected]);

  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (startedAt.current && !done) tick((n) => n + 1);
    }, 400);
    return () => clearInterval(id);
  }, [done]);

  const elapsedMs = startedAt.current ? Date.now() - startedAt.current : 0;
  const cpm = cpmFromGraphemes(stats.correctGraphemes, elapsedMs || 1);
  const acc = accuracyPercent(stats);

  const syncTyped = (raw: string) => {
    if (!expected || done) return;
    if (!startedAt.current) startedAt.current = Date.now();
    const maxLen = segmentGraphemes(expected).length;
    const capped = sliceGraphemes(raw, maxLen);

    const nextCmp = compareParagraph(expected, capped);
    if (nextCmp.hasError && !prevHadError.current) {
      setStats((s) => ({ ...s, wrongEvents: s.wrongEvents + 1 }));
    }
    prevHadError.current = nextCmp.hasError;

    if (isStrictGraphemePrefix(expected, capped) && capped.length > prevTyped.current.length) {
      const delta = countGraphemes(capped) - countGraphemes(prevTyped.current);
      if (delta > 0) {
        setStats((s) => ({ ...s, correctGraphemes: s.correctGraphemes + delta }));
      }
    }

    prevTyped.current = capped;
    setTyped(capped);
  };

  const onTypedChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    if (composing.current) {
      const maxLen = segmentGraphemes(expected).length;
      setTyped(sliceGraphemes(v, maxLen));
      return;
    }
    syncTyped(v);
  };

  const onCompositionStart = () => {
    composing.current = true;
  };

  const onCompositionEnd = (e: React.CompositionEvent<HTMLTextAreaElement>) => {
    composing.current = false;
    syncTyped(e.currentTarget.value);
  };

  const runSearch = async () => {
    setSearchNote("");
    setHits([]);
    if (!searchQ.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQ.trim())}`);
      const data = await res.json();
      if (data.error) setSearchNote(data.error);
      setHits(Array.isArray(data.results) ? data.results : []);
      if (!data.results?.length && !data.error) setSearchNote("沒有找到結果，請換關鍵字或改用手動貼上。");
    } finally {
      setSearching(false);
    }
  };

  const pickArticle = async (hit: SearchHit) => {
    setSearchNote("");
    setFetchingUrl(hit.url);
    try {
      const res = await fetch("/api/fetch-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: hit.url, title: hit.title }),
      });
      const data = await res.json();
      if (!res.ok || data.error || !data.content) {
        setSearchNote(data.error || "無法擷取正文，請改用手動貼上全文。");
        return;
      }
      applyExpected(String(data.content));
      setSearchNote(`已載入：${data.title || hit.title}`);
    } finally {
      setFetchingUrl(null);
    }
  };

  const runGenerate = async () => {
    setGenError("");
    if (!genTopic.trim()) {
      setGenError("請輸入主題");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/typing/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: genTopic.trim(), maxChars: maxG }),
      });
      const data = await res.json();
      if (data.error && !data.text) {
        setGenError(data.error);
        return;
      }
      if (data.text) applyExpected(String(data.text));
      if (data.error) setGenError(data.error);
    } finally {
      setGenerating(false);
    }
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      applyExpected(text);
    };
    reader.readAsText(f, "UTF-8");
    e.target.value = "";
  };

  const segs = useMemo(() => segmentGraphemes(expected), [expected]);

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="font-display text-xl sm:text-2xl">段落練習</CardTitle>
        <CardDescription>
          貼上或載入段落後，對照下方著色提示輸入；錯字會以紅底標示。建議使用實體鍵盤。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground">自訂段落</h3>
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="貼上或撰寫要練習的段落…"
              className="min-h-[140px] font-serif text-base leading-relaxed"
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => applyExpected(draft)}>
                設為練習內容
              </Button>
              <input ref={fileRef} type="file" accept=".txt,text/plain" className="hidden" onChange={onPickFile} />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                <FileUp className="mr-2 h-4 w-4" />
                上傳 .txt
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="collapse" checked={collapseSpace} onCheckedChange={setCollapseSpace} />
              <label htmlFor="collapse" className="text-sm text-muted-foreground">
                載入時精簡多餘空白
              </label>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">最大字數（約）：</span>
              {MAX_OPTIONS.map((n) => (
                <Button
                  key={n}
                  type="button"
                  size="sm"
                  variant={maxG === n ? "default" : "outline"}
                  onClick={() => setMaxG(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">網路文章</h3>
            <div className="flex gap-2">
              <Input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="搜尋關鍵字…"
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
              />
              <Button type="button" disabled={searching} onClick={runSearch}>
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            {searchNote && <p className="text-sm text-muted-foreground">{searchNote}</p>}
            <ul className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-border bg-muted/20 p-2 text-sm">
              {hits.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    className="w-full rounded-md px-2 py-2 text-left hover:bg-accent"
                    onClick={() => pickArticle(h)}
                    disabled={!!fetchingUrl}
                  >
                    <span className="font-medium text-foreground">{h.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{h.source}</span>
                  </button>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-medium text-foreground">AI 生成短文</h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="例如：太陽能與永續生活"
              />
              <Button type="button" disabled={generating} onClick={runGenerate}>
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                生成
              </Button>
            </div>
            {genError && <p className="text-sm text-destructive">{genError}</p>}
          </div>
        </div>

        {expected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                字／分：<strong className="text-foreground">{cpm}</strong>
              </span>
              <span>
                正確率：<strong className="text-foreground">{acc}%</strong>
              </span>
              <span>
                進度：<strong className="text-foreground">{cmp.matchLen}</strong> / {segs.length} 字元
              </span>
            </div>

            {done && (
              <div
                role="status"
                className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-center text-primary-800 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-100"
              >
                本段完成！可重新貼上或載入另一段繼續練習。
              </div>
            )}

            <div className="max-h-[min(40vh,320px)] overflow-y-auto rounded-lg border border-border bg-card px-4 py-4 font-serif text-lg leading-[1.9] tracking-wide">
              <p className="sr-only">對照用段落，請在下方輸入框練習。</p>
              <div className="whitespace-pre-wrap break-words">
                {segs.map((ch, i) => {
                  let cls = "text-muted-foreground/45";
                  if (cmp.hasError && cmp.errorIndex !== null && i === cmp.errorIndex) {
                    cls =
                      "rounded-sm bg-destructive/30 px-0.5 text-destructive-foreground ring-1 ring-destructive/50 animate-pulse";
                  } else if (i < cmp.matchLen) {
                    cls = "text-foreground";
                  } else if (i === cmp.matchLen && !cmp.hasError && !done) {
                    cls = "border-b-2 border-primary-600 text-foreground/90";
                  }
                  const isCaret = i === cmp.matchLen && !cmp.hasError && !done;
                  return (
                    <span key={i} ref={isCaret ? activeRef : undefined} className={cls}>
                      {ch}
                    </span>
                  );
                })}
              </div>
            </div>

            <Textarea
              value={typed}
              onChange={onTypedChange}
              onCompositionStart={onCompositionStart}
              onCompositionEnd={onCompositionEnd}
              disabled={done}
              placeholder={done ? "已完成" : "在此逐字輸入…"}
              className="min-h-[120px] font-serif text-lg leading-relaxed"
              aria-label="段落輸入"
            />
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">請先貼上段落、從搜尋選文，或 AI 生成，即可開始練習。</p>
        )}
      </CardContent>
    </Card>
  );
}

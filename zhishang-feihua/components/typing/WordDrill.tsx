"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { accuracyPercent, countGraphemes, cpmFromGraphemes, emptySessionStats, type SessionStats } from "@/lib/typing/metrics";
import { graphemesEqual, isStrictGraphemePrefix } from "@/lib/typing/compare";
import { getWordList, shuffleInPlace, WORD_LIST_META, type WordListId } from "@/lib/typing/word-lists";

export function WordDrill() {
  const [listId, setListId] = useState<WordListId>("basic");
  const [words, setWords] = useState<string[]>(() => shuffleInPlace(getWordList("basic")));
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [showNext, setShowNext] = useState(false);
  const composing = useRef(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [stats, setStats] = useState<SessionStats>(() => emptySessionStats());
  const startedAt = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const target = words[index] ?? "";
  const totalWords = words.length;

  const resetRound = useCallback((id: WordListId) => {
    const next = shuffleInPlace(getWordList(id));
    setWords(next);
    setIndex(0);
    setValue("");
    setErrorOpen(false);
    setStats(emptySessionStats());
    startedAt.current = null;
  }, []);

  const prevListId = useRef(listId);
  useEffect(() => {
    if (prevListId.current !== listId) {
      prevListId.current = listId;
      resetRound(listId);
    }
  }, [listId, resetRound]);

  const elapsedMs = useMemo(() => {
    if (!startedAt.current) return 0;
    return Date.now() - startedAt.current;
  }, [value, index, stats]);

  const tick = useRef(0);
  const [, force] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (startedAt.current) {
        tick.current += 1;
        force((n) => n + 1);
      }
    }, 500);
    return () => clearInterval(id);
  }, []);

  const cpm = cpmFromGraphemes(stats.correctGraphemes, elapsedMs || 1);
  const acc = accuracyPercent(stats);

  const bumpStart = () => {
    if (!startedAt.current) startedAt.current = Date.now();
  };

  const triggerError = () => {
    setErrorOpen(true);
    setStats((s) => ({ ...s, wrongEvents: s.wrongEvents + 1 }));
    setValue("");
  };

  const tryValue = (next: string) => {
    bumpStart();
    if (next.length === 0) {
      setValue("");
      return;
    }
    if (!isStrictGraphemePrefix(target, next)) {
      triggerError();
      return;
    }
    setErrorOpen(false);
    setValue(next);
  };

  const advanceWord = () => {
    const g = countGraphemes(target);
    setStats((s) => ({ ...s, correctGraphemes: s.correctGraphemes + g }));
    setValue("");
    setErrorOpen(false);
    if (index + 1 >= totalWords) {
      setIndex(0);
      setWords(shuffleInPlace(getWordList(listId)));
    } else {
      setIndex((i) => i + 1);
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (composing.current) {
      setValue(next);
      return;
    }
    tryValue(next);
  };

  const onCompositionStart = () => {
    composing.current = true;
  };

  const onCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    composing.current = false;
    tryValue(e.currentTarget.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (composing.current) return;
    if (e.key === "Enter" || e.key === " ") {
      if (graphemesEqual(value, target)) {
        e.preventDefault();
        advanceWord();
      } else if (value.length > 0) {
        e.preventDefault();
        triggerError();
      }
    }
  };

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="font-display text-xl sm:text-2xl">詞語練習</CardTitle>
        <CardDescription>
          依序輸入詞語；打錯會提示正確寫法，須改對並按 Enter 或空白鍵進入下一詞。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex flex-wrap gap-2">
            {WORD_LIST_META.map((m) => (
              <Button
                key={m.id}
                type="button"
                size="sm"
                variant={listId === m.id ? "default" : "outline"}
                onClick={() => setListId(m.id)}
              >
                {m.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Switch id="peek" checked={showNext} onCheckedChange={setShowNext} />
            <label htmlFor="peek" className="text-muted-foreground">
              預覽下一詞
            </label>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => resetRound(listId)}>
            <RotateCcw className="mr-1 h-4 w-4" />
            重開一局
          </Button>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span>
            進度：<strong className="text-foreground">{index + 1}</strong> / {totalWords}
          </span>
          <span>
            字／分：<strong className="text-foreground">{cpm}</strong>
          </span>
          <span>
            正確率：<strong className="text-foreground">{acc}%</strong>
          </span>
        </div>

        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">請輸入</p>
          <p className="mt-2 font-display text-3xl font-semibold text-primary-800 dark:text-primary-200 sm:text-4xl">
            {target || "—"}
          </p>
          {showNext && words[index + 1] && (
            <p className="mt-3 text-sm text-muted-foreground">
              下一詞：<span className="text-foreground/80">{words[index + 1]}</span>
            </p>
          )}
        </div>

        <div className="relative">
          <Keyboard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}
            placeholder="在此輸入…"
            className="pl-10 font-serif text-lg"
            aria-label="詞語輸入"
          />
        </div>

        {errorOpen && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-center text-destructive"
          >
            <p className="font-medium">請打正確詞語：</p>
            <p className="mt-1 font-display text-2xl text-foreground">{target}</p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground">
          建議使用實體鍵盤；輸入完成後按 <kbd className="rounded border bg-muted px-1">Enter</kbd> 或
          <kbd className="ml-1 rounded border bg-muted px-1">空白</kbd> 確認。
        </p>
      </CardContent>
    </Card>
  );
}

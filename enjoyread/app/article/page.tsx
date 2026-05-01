"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addReadArticle } from "@/lib/storage";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const NATURAL_VOICES = [
  { id: "zh-CN-XiaoxiaoNeural", label: "女聲（溫柔）" },
  { id: "zh-CN-XiaoyiNeural", label: "女聲（甜美）" },
  { id: "zh-CN-YunxiNeural", label: "男聲（年輕）" },
  { id: "zh-CN-YunyangNeural", label: "男聲（穩定）" },
];

function ArticleContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const title = searchParams.get("title") || "文章導讀";
  const id = searchParams.get("id") || "unknown";

  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [articleContent, setArticleContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [lastGeneratedAt, setLastGeneratedAt] = useState("");
  const [provider, setProvider] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<{ correct: number; total: number } | null>(null);

  const [ttsPlaying, setTtsPlaying] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState(1);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [naturalVoice, setNaturalVoice] = useState(NATURAL_VOICES[0].id);
  const [naturalPlaying, setNaturalPlaying] = useState(false);
  const [naturalLoading, setNaturalLoading] = useState(false);
  const [naturalStatus, setNaturalStatus] = useState("");
  const [generating, setGenerating] = useState(false);
  const naturalAudioRef = useRef<HTMLAudioElement | null>(null);

  const loadSummaryAndQuiz = async ({ regenerate = false }: { regenerate?: boolean } = {}) => {
    if (!url) {
      setError("缺少文章網址");
      setLoading(false);
      return;
    }

    setError("");
    setInlineError("");
    setStatusMessage(regenerate ? "AI 正在重新出題，請稍候..." : "AI 正在生成精華短文與題目...");
    setGenerating(true);
    try {
      let contentForQuiz = articleContent;
      let fetchedTitle = "";

      if (!contentForQuiz) {
        setStatusMessage("正在讀取文章內容...");
        const fetchRes = await fetch("/api/fetch-article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, title: decodeURIComponent(title) }),
        });
        const fetchData = await fetchRes.json();
        if (fetchData.error || !fetchData.content) {
          setInlineError(fetchData.error || "無法取得文章內容");
          return;
        }
        contentForQuiz = fetchData.content;
        fetchedTitle = fetchData.title || "";
        setArticleContent(contentForQuiz);
      }

      setStatusMessage(regenerate ? "AI 正在重新設計題目..." : "AI 正在摘要並出題...");
      const sumRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: contentForQuiz,
          url,
          regenerate,
          generationId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        }),
      });
      const sumData = await sumRes.json();
      if (sumData.error) {
        setInlineError(`AI 出題失敗：${sumData.error}`);
        return;
      }

      const nextQuestions = Array.isArray(sumData.questions) ? sumData.questions : [];
      setSummary(sumData.summary || contentForQuiz.slice(0, 400));
      setQuestions(nextQuestions);
      setAnswers({});
      setShowExplanations({});
      setQuizSubmitted(false);
      setQuizScore(null);
      setProvider(sumData.provider || "");
      setLastGeneratedAt(new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setStatusMessage(
        nextQuestions.length > 0
          ? regenerate
            ? "已重新生成新的 AI 題目。"
            : "AI 題目已生成。"
          : "AI 沒有回傳題目，請再按一次重新出題。"
      );

      addReadArticle({ id, url, title: title || fetchedTitle || "文章" });
    } catch (e) {
      setInlineError(String(e));
      setStatusMessage("");
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!url) {
      setError("缺少文章網址");
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadSummaryAndQuiz();
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [url, id, title]); // eslint-disable-line react-hooks/exhaustive-deps

  const sentences = summary
    .split(/(?<=[。！？\n])/)
    .filter((s) => s.trim().length > 0);

  const stopNaturalAudio = () => {
    if (naturalAudioRef.current) {
      naturalAudioRef.current.pause();
      naturalAudioRef.current.currentTime = 0;
      naturalAudioRef.current = null;
    }
    setNaturalPlaying(false);
  };

  const startBrowserTts = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = ttsSpeed;
    utterance.lang = "zh-TW";
    utterance.onboundary = (e) => {
      if (e.name === "sentence" || e.charIndex > 0) {
        const charCount = e.charIndex;
        let count = 0;
        for (let i = 0; i < sentences.length; i++) {
          count += sentences[i].length;
          if (count >= charCount) {
            setHighlightIndex(i);
            break;
          }
        }
      }
    };
    utterance.onend = () => {
      setTtsPlaying(false);
      setHighlightIndex(-1);
    };
    synth.speak(utterance);
    setTtsPlaying(true);
  };

  const handleTtsToggle = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    if (ttsPlaying) {
      synth.cancel();
      setTtsPlaying(false);
      setHighlightIndex(-1);
      return;
    }
    stopNaturalAudio();
    startBrowserTts();
  };

  const handleNaturalTtsToggle = async () => {
    if (naturalPlaying || naturalLoading) {
      stopNaturalAudio();
      setNaturalLoading(false);
      setNaturalStatus("");
      return;
    }

    if (!summary.trim()) {
      setNaturalStatus("尚無可朗讀的精華短文。");
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      setHighlightIndex(-1);
    }

    setNaturalLoading(true);
    setNaturalStatus("正在生成自然人聲...");
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: summary,
          voice: naturalVoice,
          speed: ttsSpeed,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.audioUrl) {
        throw new Error(data.error || "自然人聲生成失敗");
      }

      const audio = new Audio(data.audioUrl);
      naturalAudioRef.current = audio;
      audio.onended = () => {
        setNaturalPlaying(false);
        setNaturalStatus("自然人聲朗讀完成。");
      };
      audio.onerror = () => {
        setNaturalPlaying(false);
        setNaturalStatus("自然人聲播放失敗，已改用瀏覽器朗讀。");
        startBrowserTts();
      };
      await audio.play();
      setNaturalPlaying(true);
      setNaturalStatus("正在播放自然人聲。");
    } catch {
      setNaturalStatus("自然人聲暫時不可用，已改用瀏覽器朗讀。");
      startBrowserTts();
    } finally {
      setNaturalLoading(false);
    }
  };

  const handleAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [qIndex]: true }));
  };

  const handleSubmitQuiz = () => {
    if (questions.length === 0) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++;
    });
    setQuizScore({ correct, total: questions.length });
    setQuizSubmitted(true);

    const { addQuizScore } = require("@/lib/storage");
    addQuizScore(id, correct, questions.length);
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <p className="text-destructive">{error}</p>
        <Link href="/">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首頁
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center gap-4 px-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回
            </Button>
          </Link>
          <h1 className="flex-1 truncate text-lg font-semibold">{decodeURIComponent(title)}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => loadSummaryAndQuiz({ regenerate: true })}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                "AI 重新出題"
              )}
            </Button>
            <div className="flex rounded-md border">
              {[0.8, 1, 1.2].map((s) => (
                <button
                  key={s}
                  onClick={() => setTtsSpeed(s)}
                  className={`px-2 py-1 text-xs ${ttsSpeed === s ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700" : ""}`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <select
              value={naturalVoice}
              onChange={(e) => setNaturalVoice(e.target.value)}
              className="h-9 rounded-md border bg-background px-2 text-sm"
              aria-label="選擇自然人聲"
            >
              {NATURAL_VOICES.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.label}
                </option>
              ))}
            </select>
            <Button
              variant={naturalPlaying ? "destructive" : "default"}
              size="sm"
              onClick={handleNaturalTtsToggle}
              disabled={naturalLoading}
            >
              {naturalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成語音...
                </>
              ) : naturalPlaying ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  停止人聲
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  自然人聲
                </>
              )}
            </Button>
            <Button
              variant={ttsPlaying ? "destructive" : "default"}
              size="sm"
              onClick={handleTtsToggle}
            >
              {ttsPlaying ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  停止朗讀
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  瀏覽器朗讀
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="mb-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-900 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-200">
          進入此頁後會自動生成「精華短文＋AI 出題」。若想換一組新題目，請按「AI 重新出題」。
          {naturalStatus && <p className="mt-2">{naturalStatus}</p>}
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <Card>
            <CardHeader>
              <CardTitle>精華短文</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {sentences.map((s, i) => (
                  <span
                    key={i}
                    className={
                      highlightIndex === i
                        ? "bg-primary-200/80 dark:bg-primary-900/50 rounded px-0.5 transition-colors"
                        : ""
                    }
                  >
                    {s}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>AI 出題練習</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button onClick={() => loadSummaryAndQuiz({ regenerate: true })} disabled={generating} className="w-full">
                  {generating ? "AI 出題中..." : "AI 重新出題"}
                </Button>
                {(statusMessage || inlineError || lastGeneratedAt) && (
                  <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                    {statusMessage && <p>{statusMessage}</p>}
                    {lastGeneratedAt && (
                      <p>
                        最近生成：{lastGeneratedAt}
                        {provider ? `（${provider}）` : ""}
                      </p>
                    )}
                    {inlineError && <p className="text-destructive">{inlineError}</p>}
                  </div>
                )}
                {questions.map((q, qIndex) => (
                  <div key={`${lastGeneratedAt}-${qIndex}`} className="space-y-2">
                    <p className="font-medium">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleAnswer(qIndex, oIndex)}
                          disabled={quizSubmitted}
                          className={`block w-full rounded-lg border p-3 text-left text-sm transition-colors ${
                            answers[qIndex] === oIndex
                              ? quizSubmitted && q.correctIndex === oIndex
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : quizSubmitted && answers[qIndex] !== q.correctIndex && oIndex === q.correctIndex
                                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                  : answers[qIndex] === oIndex && oIndex !== q.correctIndex
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    : "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                              : "hover:bg-muted"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {showExplanations[qIndex] && (
                      <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                        <strong>解析：</strong>
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
                {questions.length > 0 && !quizSubmitted && (
                  <Button onClick={handleSubmitQuiz} className="w-full">
                    提交測驗
                  </Button>
                )}
                {quizScore && (
                  <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4 text-center">
                    <p className="text-lg font-semibold">
                      得分：{quizScore.correct} / {quizScore.total}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((quizScore.correct / quizScore.total) * 100).toFixed(0)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
      <ArticleContent />
    </Suspense>
  );
}

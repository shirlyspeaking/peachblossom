"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, Sparkles, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  clearArticleChatMessages,
  getArticleChatMessages,
  saveArticleChatMessages,
  type ArticleChatMessage,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

interface ArticleChatProps {
  articleId: string;
  articleTitle: string;
  articleContent: string;
}

const starterQuestions = [
  "這篇文章最重要的觀念是什麼？",
  "請用更簡單的話解釋這段內容",
  "幫我出一題練習題",
];

export function ArticleChat({
  articleId,
  articleTitle,
  articleContent,
}: ArticleChatProps) {
  const [messages, setMessages] = useState<ArticleChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const messagesRef = useRef<ArticleChatMessage[]>([]);

  useEffect(() => {
    const loaded = getArticleChatMessages(articleId);
    messagesRef.current = loaded;
    setMessages(loaded);
    setMobileOpen(false);
  }, [articleId]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const sendMessage = async (content: string) => {
    const question = content.trim();
    if (!question || loading || !articleContent) return;

    const userMessage: ArticleChatMessage = {
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    const prev = messagesRef.current;
    const nextMessages = [...prev, userMessage];

    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    saveArticleChatMessages(articleId, nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          articleTitle,
          articleContent,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const rawText = await res.text();
      let data: { answer?: unknown } = {};
      try {
        data = rawText.trim() ? (JSON.parse(rawText) as { answer?: unknown }) : {};
      } catch {
        data = {};
      }
      const answerStr =
        typeof data.answer === "string"
          ? data.answer
          : rawText.trim().slice(0, 600);
      const assistantMessage: ArticleChatMessage = {
        role: "assistant",
        content:
          answerStr.trim() ||
          "我暫時無法回答這個問題。你可以換個問法，或指定文章中的某一句。",
        createdAt: new Date().toISOString(),
      };
      const updatedMessages = [...nextMessages, assistantMessage];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      saveArticleChatMessages(articleId, updatedMessages);
    } catch {
      const updatedMessages = [
        ...nextMessages,
        {
          role: "assistant" as const,
          content: "AI 助教暫時連線失敗。請稍後再試。",
          createdAt: new Date().toISOString(),
        },
      ];
      messagesRef.current = updatedMessages;
      setMessages(updatedMessages);
      saveArticleChatMessages(articleId, updatedMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleClear = () => {
    messagesRef.current = [];
    setMessages([]);
    clearArticleChatMessages(articleId);
  };

  const chatPanel = (
    <Card className="flex max-h-[min(720px,calc(100vh-7rem))] flex-col overflow-hidden rounded-2xl border-primary-200/60 bg-card/95 shadow-[0_24px_60px_oklch(0.53_0.09_8_/_0.06)] backdrop-blur-sm">
      <CardHeader className="border-b border-border/70 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
              <Bot className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base">問 AI 閱讀助教</CardTitle>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                針對這篇文章提問，我會盡量只根據本文回答。
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={handleClear}
                aria-label="清除對話"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="關閉 AI 助教"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col gap-3 rounded-xl bg-muted/70 p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary-600" />
              可以這樣問
            </div>
            <div className="flex flex-col gap-2">
              {starterQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="rounded-xl border border-border/80 bg-background px-3 py-2 text-left text-sm transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading || !articleContent}
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.createdAt}-${index}`}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "ml-auto bg-primary-600 text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="flex max-w-[88%] items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                正在根據文章思考...
              </div>
            )}
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="article-chat-input">
            輸入想問 AI 助教的問題
          </label>
          <textarea
            id="article-chat-input"
            className="min-h-11 flex-1 resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm leading-relaxed ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            rows={1}
            value={input}
            placeholder="問我文章哪裡不懂..."
            disabled={loading || !articleContent}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="size-11 shrink-0"
            disabled={loading || !input.trim() || !articleContent}
            aria-label="送出問題"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="hidden lg:block">{chatPanel}</div>

      <Button
        type="button"
        className="fixed bottom-5 right-5 z-40 gap-2 rounded-full px-4 shadow-lg lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <MessageCircle className="size-4" />
        問 AI
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/35 p-3 backdrop-blur-sm lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="AI 閱讀助教"
        >
          <div className="w-full">{chatPanel}</div>
        </div>
      )}
    </>
  );
}

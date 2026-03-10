"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ArticleCard } from "@/components/ArticleCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { getReadingProgress } from "@/lib/storage";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [progressKey, setProgressKey] = useState(0);
  const progress = useMemo(() => {
    if (typeof window === "undefined") return { readCount: 0, totalQuizzes: 0, averageScore: 0 };
    return getReadingProgress();
  }, [progressKey]);

  useEffect(() => {
    const onFocus = () => setProgressKey((k) => k + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setArticles(MOCK_ARTICLES);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.results || []);
      } else {
        setArticles(
          MOCK_ARTICLES.filter(
            (a) =>
              a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
              a.source.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    } catch {
      setArticles(
        MOCK_ARTICLES.filter(
          (a) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.source.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const displayedArticles = articles.length > 0 ? articles : MOCK_ARTICLES;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="container px-4 py-8 md:px-6">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            探索知識，輕鬆閱讀
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            輸入關鍵字，發現適合中學生的優質文章。AI 幫你摘要、出題，還能語音朗讀。
          </p>
          <div className="mx-auto mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="試試：黑洞、AI、鄭和下西洋..."
                className="h-12 w-full rounded-lg border bg-background pl-12 pr-4 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-12 rounded-lg bg-primary-600 px-6 font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              搜尋
            </button>
          </div>
        </section>

        {/* Reading Progress + Articles Grid */}
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24">
              <ReadingProgress
                readCount={progress.readCount}
                totalQuizzes={progress.totalQuizzes}
                averageScore={progress.averageScore}
              />
            </div>
          </aside>

          <section className="order-1 lg:order-2">
            <h2 className="mb-6 text-2xl font-semibold">
              {searchQuery ? "搜尋結果" : "熱門文章"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {displayedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

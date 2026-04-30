"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ArticleCard } from "@/components/ArticleCard";
import { ReadingProgress } from "@/components/ReadingProgress";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { getReadingProgress } from "@/lib/storage";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [progress, setProgress] = useState({
    readCount: 0,
    totalQuizzes: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const refreshProgress = () => setProgress(getReadingProgress());
    refreshProgress();
    window.addEventListener("focus", refreshProgress);
    return () => window.removeEventListener("focus", refreshProgress);
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
    <div className="min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <main className="container px-4 py-8 md:px-6">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="font-display text-4xl font-normal tracking-[0.08em] text-primary-800 dark:text-primary-300 md:text-5xl lg:text-6xl">
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
                className="h-12 w-full rounded-2xl border border-border/80 bg-card/90 pl-12 pr-4 text-base shadow-sm ring-offset-background backdrop-blur-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-12 rounded-full bg-primary-600 px-6 font-semibold text-primary-foreground shadow-md transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <h2 className="mb-6 font-serif text-2xl font-semibold text-primary-900 dark:text-primary-200">
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

import { mockArticles } from "@/lib/mock-articles";
import { ArticleCard } from "@/components/ArticleCard";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
          探索精選文章
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          來自優質媒體的閱讀內容，搭配 AI 導讀讓理解更輕鬆。
        </p>
      </section>

      <section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}

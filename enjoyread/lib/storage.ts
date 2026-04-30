const STORAGE_KEYS = {
  READ_ARTICLES: "enjoyread-read-articles",
  QUIZ_SCORES: "enjoyread-quiz-scores",
  ARTICLE_CHAT_MESSAGES: "enjoyread-article-chat-messages",
} as const;

export interface ReadRecord {
  id: string;
  url: string;
  title: string;
  readAt: string;
}

export interface QuizScore {
  articleId: string;
  score: number;
  total: number;
  completedAt: string;
}

export interface ArticleChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

function getReadArticles(): ReadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.READ_ARTICLES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getQuizScores(): QuizScore[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getArticleChatStore(): Record<string, ArticleChatMessage[]> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ARTICLE_CHAT_MESSAGES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function addReadArticle(record: Omit<ReadRecord, "readAt">) {
  const articles = getReadArticles();
  const exists = articles.some((a) => a.id === record.id || a.url === record.url);
  if (!exists) {
    articles.unshift({
      ...record,
      readAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.READ_ARTICLES, JSON.stringify(articles));
  }
}

export function addQuizScore(articleId: string, score: number, total: number) {
  const scores = getQuizScores();
  scores.push({
    articleId,
    score,
    total,
    completedAt: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
}

export function getArticleChatMessages(articleId: string): ArticleChatMessage[] {
  const store = getArticleChatStore();
  return store[articleId] || [];
}

export function saveArticleChatMessages(
  articleId: string,
  messages: ArticleChatMessage[]
) {
  const store = getArticleChatStore();
  store[articleId] = messages.slice(-20);
  localStorage.setItem(
    STORAGE_KEYS.ARTICLE_CHAT_MESSAGES,
    JSON.stringify(store)
  );
}

export function clearArticleChatMessages(articleId: string) {
  const store = getArticleChatStore();
  delete store[articleId];
  localStorage.setItem(
    STORAGE_KEYS.ARTICLE_CHAT_MESSAGES,
    JSON.stringify(store)
  );
}

export function getReadingProgress() {
  const articles = getReadArticles();
  const scores = getQuizScores();
  const totalQuizzes = scores.length;
  const averageScore =
    totalQuizzes > 0
      ? scores.reduce((sum, s) => sum + (s.score / s.total) * 100, 0) / totalQuizzes
      : 0;
  return {
    readCount: articles.length,
    totalQuizzes,
    averageScore,
    readArticles: articles,
    quizScores: scores,
  };
}

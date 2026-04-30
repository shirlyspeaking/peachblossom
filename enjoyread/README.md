# 悅讀 EnjoyRead — 中學生閱讀平台

整合 AI 搜尋、文章摘要、自動出題與 TTS 語音朗讀的現代化教育平台。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS
- **UI**: Shadcn UI、Lucide React
- **搜尋**: Tavily Search API
- **AI**: Google Gemini / OpenAI GPT / DeepSeek
- **TTS**: 瀏覽器 Web Speech API
- **儲存**: LocalStorage (MVP)

## 快速開始

```bash
cd enjoyread
npm install
cp .env.example .env.local
# 編輯 .env.local 填入 API Key
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 環境變數

| 變數 | 說明 |
|------|------|
| `TAVILY_API_KEY` | Tavily 搜尋 API Key（搜尋功能） |
| `GOOGLE_AI_API_KEY` | Google Gemini API Key（摘要與出題） |
| `OPENAI_API_KEY` | OpenAI API Key（可替代 Gemini） |
| `DEEPSEEK_API_KEY` | DeepSeek API Key（文章旁 AI 問答） |

未設定 AI Key 時，仍可瀏覽文章與使用 Mock 摘要；未設定 DeepSeek Key 時，文章旁問答會顯示設定提示。

## 功能

- ✅ 首頁 Hero 搜尋、熱門文章卡片
- ✅ 深色模式
- ✅ Tavily 搜尋整合
- ✅ 文章正文抓取、AI 精華摘要、自動出題
- ✅ 文章旁 DeepSeek AI 問答助教
- ✅ TTS 語音朗讀、語速調整、句子高亮
- ✅ LocalStorage 閱讀進度、測驗分數、統計圖表

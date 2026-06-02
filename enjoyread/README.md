# 摸鱼俱乐部 Cyberloafing Club — 中學生閱讀平台

整合 AI 搜尋、文章摘要、自動出題與 TTS 語音朗讀的現代化教育平台。

## 技術棧

- **框架**: Next.js 15 (App Router)
- **樣式**: Tailwind CSS
- **UI**: Shadcn UI、Lucide React
- **搜尋**: Tavily Search API
- **AI**: DeepSeek / Google Gemini / OpenAI GPT
- **TTS**: FreeTTS 自然人聲 / 瀏覽器 Web Speech API fallback
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
| `DEEPSEEK_API_KEY` | DeepSeek API Key（預設優先的摘要與出題） |
| `DEEPSEEK_BASE_URL` | DeepSeek API Base URL（預設 `https://api.deepseek.com`） |
| `DEEPSEEK_MODEL` | DeepSeek 模型名稱（預設 `deepseek-chat`） |
| `GOOGLE_AI_API_KEY` | Google Gemini API Key（摘要與出題） |
| `OPENAI_API_KEY` | OpenAI API Key（可替代 Gemini） |
| `FREETTS_API_KEY` | FreeTTS API Key（自然人聲朗讀，可選） |

AI 會依序嘗試：DeepSeek → Gemini → OpenAI；都不可用時，仍可瀏覽文章與使用 Mock 摘要。

## 功能

- ✅ 首頁 Hero 搜尋、熱門文章卡片
- ✅ 深色模式
- ✅ Tavily 搜尋整合
- ✅ 文章正文抓取、AI 精華摘要、自動出題
- ✅ 自然人聲朗讀、瀏覽器朗讀 fallback、語速調整、句子高亮
- ✅ LocalStorage 閱讀進度、測驗分數、統計圖表

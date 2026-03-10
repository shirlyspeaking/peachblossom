# 悅讀 (EnjoyRead) 中學生閱讀平台 — Cursor 開發 SOP

## 專案目標

打造一個整合 **AI 搜尋**、**文章摘要**、**自動出題** 與 **TTS 語音朗讀** 的現代化教育平台。

---

## 第一階段：基礎架構與 UI 佈局 (Initial Setup)

**目標：** 建立 Next.js 專案骨架與響應式介面。

### Cursor Prompt 1

```
請使用 Next.js 14 (App Router)、Tailwind CSS、Lucide React 與 Shadcn UI 初始化專案。

建立一個現代化的導覽列（包含搜尋框、Logo、分頁標籤）。

設計首頁佈局：包含一個大大的搜尋區塊（Hero Section）以及下方展示熱門文章的卡片網格 (Grid)。

文章卡片應包含：來源標籤 (e.g., 科學人)、標題、簡短摘要、預計閱讀時間、以及一個『進入導讀』按鈕。

請先使用 Mock Data 填充，並確保支援深色模式 (Dark Mode)。
```

### 預期產出

| 項目 | 說明 |
|------|------|
| 專案結構 | `app/`, `components/`, `lib/` |
| 導覽列 | Logo、搜尋框、分頁標籤 |
| Hero Section | 大型搜尋區塊 |
| 文章卡片 | 來源、標題、摘要、閱讀時間、進入導讀按鈕 |
| 主題 | 支援 Light / Dark Mode |

---

## 第二階段：全媒體搜尋功能 (Search Integration)

**目標：** 串接搜尋引擎 API (建議使用 Tavily 或 Serper) 獲取最新文章。

### Cursor Prompt 2

```
請整合 Tavily Search API。

建立一個 API Route (/api/search)，接收關鍵字並回傳經過過濾的網頁搜尋結果。

實作搜尋功能：當使用者在首頁搜尋時，動態更新文章卡片。

過濾規則：優先顯示適合中學生的科學、歷史、社會、科技類文章，排除不適宜內容。
```

### 預期產出

| 項目 | 說明 |
|------|------|
| API Route | `app/api/search/route.ts` |
| 搜尋邏輯 | 關鍵字 → Tavily API → 過濾結果 |
| 過濾規則 | 科學、歷史、社會、科技；排除不適宜內容 |
| 前端整合 | 搜尋即時更新文章卡片 |

### 環境變數

```env
TAVILY_API_KEY=your_tavily_api_key
```

---

## 第三階段：AI 精華摘要與自動出題 (AI Processing)

**目標：** 使用 Gemini 2.5 Flash 或 GPT-4o 進行文本分析與內容生成。

### Cursor Prompt 3

```
請開發文章詳情頁面與 AI 處理功能。

當點擊『進入導讀』時，根據 URL 抓取網頁正文內容。

調用 AI API 執行以下任務：

1. 精華短文：將文章縮寫成 400 字內、適合中學程度閱讀的短文。
2. 自動出題：根據短文生成 3 題選擇題（包含正確答案與解析）。

UI 設計：左側顯示短文，右側顯示互動式題目。當學生答題後，顯示解析。
```

### 預期產出

| 項目 | 說明 |
|------|------|
| 文章詳情頁 | `app/article/[id]/page.tsx` 或類似路由 |
| 正文抓取 | 根據 URL 擷取網頁正文 (可考慮 Cheerio / Jina Reader) |
| AI 摘要 | 400 字內精華短文 |
| 自動出題 | 3 題選擇題 + 答案 + 解析 |
| 版面 | 左：短文；右：題目；答題後顯示解析 |

### 環境變數

```env
GOOGLE_AI_API_KEY=your_gemini_api_key
# 或
OPENAI_API_KEY=your_openai_api_key
```

---

## 第四階段：TTS 語音朗讀功能 (Voice/Audio)

**目標：** 讓學生可以聽文章，增強學習體驗。

### Cursor Prompt 4

```
請在閱讀頁面整合 TTS 語音功能。

加入一個『語音朗讀』按鈕。

使用 OpenAI TTS API 或瀏覽器原生 Web Speech API。

功能需求：支援播放/暫停、語速調整（0.8x, 1x, 1.2x）。

朗讀時，目前的句子應有高亮 (Highlight) 效果。
```

### 預期產出

| 項目 | 說明 |
|------|------|
| 語音朗讀按鈕 | 播放 / 暫停 |
| 語速控制 | 0.8x、1x、1.2x |
| 高亮效果 | 朗讀中的句子即時高亮 |
| TTS 來源 | OpenAI TTS 或 Web Speech API |

### 環境變數 (若使用 OpenAI TTS)

```env
OPENAI_API_KEY=your_openai_api_key
```

---

## 第五階段：進度追蹤與個人化 (Storage & Logic)

**目標：** 讓學生記錄閱讀過的內容與測驗分數。

### Cursor Prompt 5

```
請整合 Supabase (或 LocalStorage 作為 MVP 版本) 儲存功能。

紀錄學生已閱讀的文章列表。

紀錄每篇測驗的分數。

在首頁顯示『我的閱讀進度』統計圖表。
```

### 預期產出

| 項目 | 說明 |
|------|------|
| 閱讀紀錄 | 已閱讀文章列表 |
| 測驗分數 | 每篇文章的測驗成績 |
| 統計圖表 | 首頁「我的閱讀進度」視覺化 |
| 儲存方案 | Supabase 或 LocalStorage (MVP) |

### 環境變數 (若使用 Supabase)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Cursor 使用小貼士

| 技巧 | 說明 |
|------|------|
| **Composer 模式** | 強烈建議使用 `Cmd + I` (Composer)，可同時修改多個檔案，適合建立整個頁面。 |
| **修復 Bug** | 若執行出錯，直接點擊錯誤訊息旁的 **Fix with AI**。 |
| **組件一致性** | 要求 Cursor 參考已存在的 `components/ui` 資料夾內的組件，以維持風格統一。 |
| **分階段執行** | 依序完成五個階段，每階段完成後先測試再進入下一階段。 |
| **環境變數** | 將 API Key 放在 `.env.local`，並加入 `.gitignore`。 |

---

## 技術棧總覽

| 類別 | 技術 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 樣式 | Tailwind CSS |
| UI 組件 | Shadcn UI、Lucide React |
| 搜尋 | Tavily Search API |
| AI | Gemini 2.5 Flash / GPT-4o |
| TTS | OpenAI TTS / Web Speech API |
| 儲存 | Supabase / LocalStorage |

---

## 專案結構建議

```
enjoyread/
├── app/
│   ├── api/
│   │   ├── search/
│   │   ├── summarize/
│   │   └── tts/
│   ├── article/
│   │   └── [id]/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          # Shadcn 組件
│   ├── ArticleCard.tsx
│   ├── SearchBar.tsx
│   └── ReadingProgress.tsx
├── lib/
│   ├── search.ts
│   ├── ai.ts
│   └── storage.ts
└── .env.local
```

---

*本 SOP 適用於使用 Cursor IDE 進行悅讀平台開發，可依實際需求調整各階段 Prompt。*

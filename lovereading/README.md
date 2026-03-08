# 樂閱 Love Reading

中學生全媒體閱讀平台 — 使用 Next.js 14+ (App Router)、Tailwind CSS、Shadcn UI 風格組件與 Lucide React 圖標。

## 技術棧

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + Shadcn UI 風格組件
- **Icons:** Lucide React
- **State:** React Hooks

## 開始使用

```bash
cd lovereading
npm install
npm run dev
```

在瀏覽器開啟 [http://localhost:3000](http://localhost:3000)。

## 專案結構

```
src/
├── app/              # App Router 頁面與 layout
│   ├── api/          # API 路由
│   ├── favorites/    # 收藏頁
│   ├── progress/     # 學習進度頁
│   ├── layout.tsx
│   ├── page.tsx      # 首頁（探索）
│   └── globals.css
├── components/       # 共用組件
│   ├── ui/           # 基礎 UI（Button, Card, Input）
│   ├── Navbar.tsx
│   ├── ArticleCard.tsx
│   └── ThemeToggle.tsx
└── lib/              # 工具與資料
    ├── utils.ts
    └── mock-articles.ts
```

## 功能

- 響應式導覽列：Logo、搜尋框、探索 / 收藏 / 學習進度
- 首頁文章卡片網格（Mock 資料，含「AI 導讀」按鈕）
- 深色模式切換（明亮但不刺眼，適合中學生）

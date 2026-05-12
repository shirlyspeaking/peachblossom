# 指上飛花（Zhishang Feihua）

獨立 Next.js 應用：詞語練習與段落練習，視覺風格對齊桃花源系。

## 桃花源首頁

根目錄 [index.html](../index.html) 已加入「指上飛花」卡片，連結為 `zhishang-feihua/`（靜態 [index.html](./index.html)）。**線上網址已預填在該檔第 7 行** `meta name="zhishang-feihua-app-url"`（預設為 `https://zhishang-feihua.pages.dev`）；若你的 Cloudflare Pages 網址不同，只改這一行；頁面上的「進入指上飛花」按鈕會讀取同一網址。

## 開發

```bash
cd zhishang-feihua
npm install
npm run dev
```

預設埠：`3210`。

## 環境變數（選用）

- `TAVILY_API_KEY`：段落練習「網路搜尋」載入文章。
- `DEEPSEEK_API_KEY`（可選 `DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`）：AI 生成短文。

未設定時，搜尋／生成會顯示友善提示，仍可用手動貼上或 .txt 上傳練習。

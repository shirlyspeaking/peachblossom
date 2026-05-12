# 指上飛花（Zhishang Feihua）

獨立 Next.js 應用：詞語練習與段落練習，視覺風格對齊桃花源系。

## 桃花源首頁

根目錄 [index.html](../index.html) 已加入「指上飛花」卡片，連結為 `zhishang-feihua/`（靜態 [index.html](./index.html)）。部署 Next 後請在該 `index.html` 的 `meta name="zhishang-feihua-app-url"` 填入正式網址，訪客會自動跳轉；除錯可加網址參數 `?stay=1` 暫停跳轉。

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

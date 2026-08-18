# 山海經 · 捲軸入口

桃花源的《山海經》主題 3D 入口原型。結構借自 [igloo.inc](https://www.igloo.inc/) 的 scroll 敘事，視覺改為雲海、方壺與玉簡。

## 開發

```bash
cd shanhaijing-landing
npm install
npm run dev
```

瀏覽器打開終端機顯示的本機網址（預設 `http://localhost:5180`）。

- 下捲：鏡頭穿越雲海 → 方壺 → 玉簡藏閣
- 點擊三塊玉簡：進入山海密室、山海經大富翁、山海浮島
- 「音：開」：以瀏覽器合成的風聲，無需音訊檔

## 建置

```bash
npm run build
npm run preview
```

靜態站若以資料夾方式提供此 app，請把 `dist/` 內容放到 `shanhaijing-landing/` 可被存取的位置，或維持原始碼並在部署流程執行 `npm run build`。

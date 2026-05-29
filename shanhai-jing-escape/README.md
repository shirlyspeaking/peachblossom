# 山海密室 · Shanhai Escape

桃花源（Peachblossom）旗下 **獨立網頁小遊戲**，與 **EnjoyRead（`enjoyread/`）程式與檔案完全分離**。本資料夾即為此 App 的根目錄：計畫、說明與程式碼皆在這裡。

## 如何試玩

- 於本機直接用瀏覽器開啟 [`index.html`](index.html)，或以靜態伺服器根目錄指到此資料夾。
- 若從桃花源首頁進入：首頁 [`index.html`](../index.html) 已提供入口連結（僅連結，不包含本 App 的程式碼）。

## 目錄結構

| 路徑 | 說明 |
|------|------|
| [`index.html`](index.html) | 單一入口頁 |
| [`styles/base.css`](styles/base.css) | 版面與主題樣式 |
| [`scripts/game.js`](scripts/game.js) | 場景切換、謎題邏輯、進度 |
| [`assets/`](assets/) | 圖片／音效（預留） |
| [`docs/PLAN.md`](docs/PLAN.md) | 設計計畫與擴充方向（權威副本） |

## 目前版本（prototype）

- 中央 **山川輿圖** 選五方試煉（對應九尾狐、燭龍、刑天、精衛、夸父）。
- 各區通關取得 **符印數字**，集齊後於 **終幕·山海合一** 輸入組合密碼結束遊戲。

後續可依 [`docs/PLAN.md`](docs/PLAN.md) 擴充雙軌線索、提示經濟與美術資源。

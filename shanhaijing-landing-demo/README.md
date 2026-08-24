# 山海經 · 捲軸入口

桃花源的《山海經》主題 3D 入口。結構借自 [igloo.inc](https://www.igloo.inc/) 的 scroll 敘事，視覺為冰屋與神獸。

原始碼在 `shanhaijing-landing-demo/`，靜態建置產物輸出到 `shanhaijing-landing/`（桃花源首頁與 Cloudflare Pages 連這裡）。

## 開發

```bash
cd shanhaijing-landing-demo
npm install --strict-ssl false
npm run dev
```

瀏覽器打開 `http://localhost:5180/`。場景是動態載入，改 3D 後請強制重新整理。

## 建置（上線用）

```bash
cd shanhaijing-landing-demo
npm run build
```

會把 hash 後的 JS/CSS 寫進 `../shanhaijing-landing/`，線上才能當成靜態頁打開。盤古爆炸音效放在 `public/audio/kaiduan-bao.mp3`，建置後會跟著靜態站上線，網址為 `/shanhaijing-landing/audio/kaiduan-bao.mp3`。

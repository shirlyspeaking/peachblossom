# 桃源萬象大富翁

這是 `shanhaijing-monopoly` 的現代化重構版本。第一個劇本沿用《山海經》世界觀，目標是把原本單一 HTML 檔中的樣式、DOM 操作、遊戲邏輯、線上房間同步與登入整合，拆成可維護、可擴充到不同故事劇本的多檔案前端專案。

## 技術棧

- Vue 3
- TypeScript
- Vite
- Pinia
- Vitest
- Playwright

## 目錄結構

```text
src/
├── components/      # 畫面元件
├── composables/     # 狀態與互動邏輯
├── config/          # 常數設定
├── stores/          # Pinia stores
├── types/           # TypeScript 型別
└── utils/           # 純工具函式

tests/
├── e2e/             # Playwright 煙霧測試
└── unit/            # Vitest 單元測試
```

## 已搬移功能

- 本機遊戲狀態與自動儲存
- 棋盤地塊編輯
- 玩家金幣與回合流程
- 機會卡 / 命運卡編輯與抽牌
- Google 登入狀態檢查
- 線上房間建立 / 加入 / 輪詢同步
- 棋盤收藏儲存 / 載入 / 刪除

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 測試

```bash
npm run test:unit
npm run test:e2e
```

## 說明

- 舊版仍保留在 `../shanhaijing-monopoly/index.html`
- 新版獨立放在 `shanhaijing-monopoly-vue/`
- 目前以「先完成架構拆分與功能遷移」為優先，後續可以再逐步細化 UI、測試與部署流程

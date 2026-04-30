# 山海浮島大富翁 3D

這是基於 `shanhaijing-monopoly-vue` 另起的新版本，方向是把山海經大富翁重構成 Three.js 3D 桌遊棋盤。

## 技術棧

- Vue 3
- TypeScript
- Vite
- Three.js

## 目前完成

- 3D 浮島棋盤與中心沙盤
- 3D 玩家棋子與目前玩家高亮
- 3D 骰子動畫與回合推進
- 地塊選取、持有者顯示、購買流程
- 機會 / 命運牌抽牌彈窗
- 本機遊戲狀態保存
- 響應式控制面板與巡遊紀錄

## 開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

## 後續方向

- 將原版線上房間與 Google 登入同步搬到 3D 版
- 補上卡片與棋盤編輯器
- 增加可旋轉 / 聚焦鏡頭控制
- 將 Three.js 場景拆成更細的渲染模組
- 針對 Three.js chunk 做 lazy loading 或分包

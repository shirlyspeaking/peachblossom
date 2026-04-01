# font-admin

桃花源管理員工具（獨立 app，與 `lovereading` 平行）。

## 功能

- 顯示字型檔是否存在
- 顯示授權標記（來自 `lovereading/public/fonts/font-manifest.json`）
- 顯示檔案最後更新時間
- 顯示授權檢視日與到期提醒（`reviewDate`）
- 匯出健康檢查報告（JSON / CSV）
- 管理 API 金鑰保護（`FONT_ADMIN_KEY`）

## 開發

```bash
cd font-admin
npm install
# 建議設定管理金鑰
export FONT_ADMIN_KEY="your-secure-key"
npm run dev
```

預設埠號：`3101`

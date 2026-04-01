# copybook-platform-admin

桃花源「字帖生成平台」管理工具（獨立 app，與 `calligraphy-studio` 平行）。

## 功能

- 顯示字型檔是否存在
- 顯示授權標記（來自 `calligraphy-studio/public/fonts/font-manifest.json`）
- 顯示檔案最後更新時間
- 顯示授權檢視日與到期提醒（`reviewDate`）
- 匯出平台維運報告（JSON / CSV）
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

## 上線前檢查

- 請參考根目錄文件：`書法字帖平台上線檢查清單.md`
- 發版當日請依序執行：`書法字帖平台發版當日Runbook.md`

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
```

**授權方式（擇一或並存）：**

1. **桃花源中央 Google 登入**（建議）：部署 [`workers/auth/`](../workers/auth/) 後設定：
   - `PEACHBLOSSOM_AUTH_URL` — 例如 `https://auth.peachspring.cc`
   - `NEXT_PUBLIC_PEACHBLOSSOM_AUTH_URL` — 與上相同（供瀏覽器）
   - 並在 Auth Worker 設定 `AUTH_ADMIN_EMAILS`（或 D1 `user_roles`）以授權你的 Google 信箱使用本後台。

2. **管理金鑰（可選後備）：**
   ```bash
   export FONT_ADMIN_KEY="your-secure-key"
   ```

```bash
npm run dev
```

預設埠號：`3101`

## 上線前檢查

- 請參考根目錄文件：`書法字帖平台上線檢查清單.md`
- 發版當日請依序執行：`書法字帖平台發版當日Runbook.md`

# Workers 選用說明（進階）

本文件為 [Cloudflare-後端與郵件登入.md](./Cloudflare-後端與郵件登入.md) 第五節的展開說明。

## 什麼時候不需要 Workers

若你的目標只是「**特定的人用郵件驗證碼才能看網站**」，請優先使用 **Cloudflare Access（One-time PIN）**，不必寫 Workers。

## 什麼時候需要 Workers

- 自訂登入 UI、Session、與資料庫中的使用者一對一對應。  
- 在邊緣實作 API（驗簽、限流、讀寫 D1/KV）。  
- Access 無法滿足的進階規則（與企業 IdP 以外的深度整合等）。

## 大致技術堆疊（概念）

1. **Wrangler**：本機開發與部署 Workers 的官方 CLI。  
2. **Workers**：路由（例如 `/auth/*`、`/api/*`）、轉發靜態資源。  
3. **寄信**：Access 的 OTP 由 Cloudflare 處理；自架流程需 **Resend、SendGrid** 等 API 發信。  
4. **儲存**：**KV**（鍵值）、**D1**（SQLite）依資料模型選擇。

## 與本倉庫的關係

目前 **peachblossom** 未包含 Workers 原始碼。若你日後新增，建議在倉庫根目錄建立獨立 `workers/` 子專案，並在該處放置 `wrangler.toml` 與 README，避免與根目錄靜態站、Next.js 子專案混淆。
